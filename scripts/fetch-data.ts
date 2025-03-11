#!/usr/bin/env tsx

// Load environment variables from .env files
import { config as dotenvConfig } from "dotenv";
import path from "path";
import fs from "fs";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { fetchDataFromDatabase, Host } from "@/lib/data";

// Try to load from .env.local first, then fall back to .env
dotenvConfig({ path: path.resolve(process.cwd(), ".env.local") });
dotenvConfig({ path: path.resolve(process.cwd(), ".env") });

// Log the DATABASE_URL to debug (remove in production)
console.log(
  "DATABASE_URL from env:",
  process.env.DATABASE_URL
    ? "Defined (value hidden for security)"
    : "Not defined"
);

// Helper function to check if DATABASE_URL is valid
function validateDatabaseUrl(url: string | undefined): string | null {
  if (!url) {
    console.error("DATABASE_URL is not defined in environment variables");
    return null;
  }

  try {
    // Simple validation of database URL format
    if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
      console.error(
        "DATABASE_URL must start with postgres:// or postgresql://"
      );
      return null;
    }

    return url;
  } catch (error) {
    console.error("Invalid DATABASE_URL:", error);
    return null;
  }
}

// Initialize database connection with fallback options
function createDbConnection() {
  // Validate the DATABASE_URL
  const dbUrl = validateDatabaseUrl(process.env.DATABASE_URL);

  if (!dbUrl) {
    console.error("Cannot establish database connection: Invalid DATABASE_URL");
    process.exit(1);
  }

  // Set up database connection
  try {
    return new Kysely<Host>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: dbUrl,
          // Make SSL optional based on the connection string
          ssl: {
            rejectUnauthorized: false,
          },
          //   ...(dbUrl.includes("sslmode=require")
          //     ? {
          //         ssl: {
          //           rejectUnauthorized: false,
          //         },
          //       }
          //     : {}),
        }),
      }),
    });
  } catch (error) {
    console.error("Failed to create database connection:", error);
    process.exit(1);
  }
}

// Create the database connection
const db = createDbConnection();

// Main function to fetch all data types and save to JSON files
async function main() {
  try {
    // Create the data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Fetch and save Collectives data
    const collectivesData = await fetchDataFromDatabase();
    fs.writeFileSync(
      path.join(dataDir, "collectives.json"),
      JSON.stringify(collectivesData, null, 2)
    );
    console.log("Collectives data saved to data/collectives.json");

    // Add more data fetching functions here as needed
    // For example: const usersData = await fetchUsersData();

    console.log("All data fetched and saved successfully!");

    // Close the database connection
    await db.destroy();
  } catch (error) {
    console.error("Error fetching or saving data:", error);
    process.exit(1);
  }
}

// Run the main function
main();
