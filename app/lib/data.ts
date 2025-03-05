import { config as dotenvConfig } from "dotenv";

import { DB } from "kysely-codegen";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

dotenvConfig({ path: path.resolve(process.cwd(), ".env.local") });
dotenvConfig({ path: path.resolve(process.cwd(), ".env") });
// Note: We use ES module imports throughout the codebase for consistency.

// Helper function to check if DATABASE_URL is valid
function validateDatabaseUrl(url: string | undefined): string | null {
  if (!url) {
    console.warn("DATABASE_URL is not defined in environment variables");
    return null;
  }

  try {
    // Simple validation of database URL format
    if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
      console.warn("DATABASE_URL must start with postgres:// or postgresql://");
      return null;
    }

    return url;
  } catch (error) {
    console.warn("Invalid DATABASE_URL:", error);
    return null;
  }
}

// Initialize database connection with fallback options
function createDbConnection() {
  // Validate the DATABASE_URL
  const dbUrl = validateDatabaseUrl(process.env.DATABASE_URL);

  if (!dbUrl) {
    console.warn("Cannot establish database connection: Invalid DATABASE_URL");
    return null;
  }

  // Set up database connection
  try {
    return new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: dbUrl,
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      }),
    });
  } catch (error) {
    console.warn("Failed to create database connection:", error);
    return null;
  }
}

// Create the database connection
const db = createDbConnection();

// Function to fetch data - now reads from JSON file instead of directly from database
export async function fetchData(): Promise<
  ReturnType<typeof fetchDataFromDatabase>
> {
  try {
    console.log("Reading data from static JSON file...");

    // Path to the data file
    const dataFilePath = path.join(process.cwd(), "data", "collectives.json");

    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.warn(
        "Data file not found. You may need to run the fetch-data script first."
      );
      return [];
    }

    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    console.log(`Retrieved ${data.length} items from static file`);

    return data;
  } catch (error) {
    console.error("Error reading data file:", error);
    throw new Error("Failed to fetch data from static file");
  }
}

// If direct database access is still needed, provide an alternative function
export async function fetchDataFromDatabase() {
  if (!db) {
    console.error("Database connection not available");
    throw new Error("Database connection not available");
  }

  try {
    console.log("Fetching data directly from PostgreSQL...");

    // Calculate date ranges for time-based metrics
    const now = new Date();

    // Previous calendar month (start and end dates)
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const prevMonthStart = new Date(
      prevMonthEnd.getFullYear(),
      prevMonthEnd.getMonth(),
      1
    );

    // Past 12 calendar months (excluding current month)
    const pastYearEnd = prevMonthEnd;
    const pastYearStart = new Date(
      pastYearEnd.getFullYear() - 1,
      pastYearEnd.getMonth() + 1,
      1
    );

    // Original database query with additional metrics
    const rows = await db
      .selectFrom("Collectives" as keyof DB)
      .where("isHostAccount", "=", true)
      .where("deletedAt", "is", null)
      // Left join for paid expenses count (total)
      .leftJoin(
        db
          .selectFrom("Expenses" as keyof DB)
          .select([
            "CollectiveId",
            db.fn.count<string>("id").as("paidExpensesCount"),
          ])
          .where("status", "=", "PAID")
          .groupBy("CollectiveId")
          .as("paidExpenses"),
        "Collectives.id",
        "paidExpenses.CollectiveId"
      )
      // Left join for paid expenses in previous month
      .leftJoin(
        db
          .selectFrom("Expenses" as keyof DB)
          .select([
            "CollectiveId",
            db.fn.count<string>("id").as("expensesPaidPastMonth"),
          ])
          .where("status", "=", "PAID")
          .where("updatedAt", ">=", prevMonthStart)
          .where("updatedAt", "<=", prevMonthEnd)
          .groupBy("CollectiveId")
          .as("paidExpensesPastMonth"),
        "Collectives.id",
        "paidExpensesPastMonth.CollectiveId"
      )
      // Left join for paid expenses in past year (excluding current month)
      .leftJoin(
        db
          .selectFrom("Expenses" as keyof DB)
          .select([
            "CollectiveId",
            db.fn.count<string>("id").as("expensesPaidPastYear"),
          ])
          .where("status", "=", "PAID")
          .where("updatedAt", ">=", pastYearStart)
          .where("updatedAt", "<=", pastYearEnd)
          .groupBy("CollectiveId")
          .as("paidExpensesPastYear"),
        "Collectives.id",
        "paidExpensesPastYear.CollectiveId"
      )
      // Left join for incoming transactions in previous month
      .leftJoin(
        db
          .selectFrom("Transactions" as keyof DB)
          .select([
            "CollectiveId",
            db.fn.sum<string>("amount").as("totalCrowdfundingPastMonth"),
          ])
          .where("type", "=", "CREDIT")
          .where("createdAt", ">=", prevMonthStart)
          .where("createdAt", "<=", prevMonthEnd)
          .groupBy("CollectiveId")
          .as("crowdfundingPastMonth"),
        "Collectives.id",
        "crowdfundingPastMonth.CollectiveId"
      )
      // Left join for incoming transactions in past year (excluding current month)
      .leftJoin(
        db
          .selectFrom("Transactions" as keyof DB)
          .select([
            "CollectiveId",
            db.fn.sum<string>("amount").as("totalCrowdfundingPastYear"),
          ])
          .where("type", "=", "CREDIT")
          .where("createdAt", ">=", pastYearStart)
          .where("createdAt", "<=", pastYearEnd)
          .groupBy("CollectiveId")
          .as("crowdfundingPastYear"),
        "Collectives.id",
        "crowdfundingPastYear.CollectiveId"
      )
      // Left join for count of active hosted collectives
      .leftJoin(
        db
          .selectFrom("Collectives as HostedCollectives" as keyof DB)
          .select([
            "HostCollectiveId",
            db.fn.count<string>("id").as("numberOfCollectives"),
          ])
          .where("isActive", "=", true)
          .where("HostCollectiveId", "is not", null) // Fix for whereNotNull
          .groupBy("HostCollectiveId")
          .as("hostedCollectives"),
        "Collectives.id",
        "hostedCollectives.HostCollectiveId"
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .select((eb: any) => [
        "Collectives.id",
        "Collectives.name",
        "Collectives.slug",
        "Collectives.description",
        "Collectives.image",
        "Collectives.currency",
        "Collectives.createdAt",
        "Collectives.updatedAt",
        // Add more columns as needed from Collectives
        eb.fn
          .coalesce(eb.ref("paidExpenses.paidExpensesCount"), eb.val("0"))
          .as("paidExpensesCount"),
        // New metrics
        eb.fn
          .coalesce(
            eb.ref("paidExpensesPastMonth.expensesPaidPastMonth"),
            eb.val("0")
          )
          .as("expensesPaidPastMonth"),
        eb.fn
          .coalesce(
            eb.ref("paidExpensesPastYear.expensesPaidPastYear"),
            eb.val("0")
          )
          .as("expensesPaidPastYear"),
        eb.fn
          .coalesce(
            eb.ref("hostedCollectives.numberOfCollectives"),
            eb.val("0")
          )
          .as("numberOfCollectives"),
        eb.fn
          .coalesce(
            eb.ref("crowdfundingPastMonth.totalCrowdfundingPastMonth"),
            eb.val("0")
          )
          .as("totalCrowdfundingPastMonth"),
        eb.fn
          .coalesce(
            eb.ref("crowdfundingPastYear.totalCrowdfundingPastYear"),
            eb.val("0")
          )
          .as("totalCrowdfundingPastYear"),
      ])
      .execute();

    console.log(`Retrieved ${rows.length} items from database`);

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data from database");
  }
}
