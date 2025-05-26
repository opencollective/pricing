import { config as dotenvConfig } from "dotenv";

import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

dotenvConfig({ path: path.resolve(process.cwd(), ".env.local") });
dotenvConfig({ path: path.resolve(process.cwd(), ".env") });
// Note: We use ES module imports throughout the codebase for consistency.

// Define types manually instead of using kysely-codegen
export type Host = {
  id: number;
  slug: string;
  name: string;
  type: "USER" | "ORGANIZATION" | "COLLECTIVE";
  hostFeePercent: number;
  totalCollectives: number;
  image?: string;
  // totalActiveCollectives: number;
  // totalExpenses: number;
  monthlyExpenses: { month: string; count: number }[];
  monthlyActiveCollectives: { month: string; count: number }[];
  totalRaisedUSD: number;
  totalRaisedCrowdfundingUSD: number;
  totalRaisedNonCrowdfundingUSD: number;
  totalDisbursedUSD: number;
  totalPlatformTips: number;
  platformTips?: boolean;
  automatedPayouts: boolean;
  taxForms: boolean;
  totalHostFeesUSD: number;
  totalHostFeesCrowdfundingUSD: number;
};

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
    return new Kysely<Host>({
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

    // Start timing the query execution
    const startTime = performance.now();

    // Calculate date ranges for time-based metrics
    const now = new Date();

    // Previous calendar month (start and end dates)
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Past 12 calendar months (excluding current month)
    const pastYearEnd = prevMonthEnd;
    const pastYearStart = new Date(
      pastYearEnd.getFullYear() - 1,
      pastYearEnd.getMonth() + 1,
      1
    );

    // Format dates for SQL query
    const queryStartDate = pastYearStart.toISOString().split("T")[0];
    const queryEndDate = pastYearEnd.toISOString().split("T")[0];

    // Generate dates for the past 12 months to use in our query
    const monthDates = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(pastYearEnd);
      monthDate.setMonth(pastYearEnd.getMonth() - i);

      const startOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      monthDates.push({
        monthLabel: startOfMonth.toISOString().substring(0, 7), // YYYY-MM format
        startDate: startOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
        endDate: endOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
      });
    }

    const rawQuery = sql<Host>`
      WITH "Hosts" AS (
        SELECT c.* 
        FROM "Collectives" c
        INNER JOIN "Transactions" t ON t."HostCollectiveId" = c."id"
        WHERE c."isHostAccount" IS TRUE 
          AND t."deletedAt" IS NULL
          AND t."createdAt" > ${queryStartDate}
          AND c."deletedAt" IS NULL
          AND c."id" NOT IN (969, 9804, 11049)
        GROUP BY c."id"
      ),

      "AmountRaised" AS (
        SELECT h."id", COALESCE(SUM(t1."amountInHostCurrency"), 0) AS "totalRaised", 
              t1."hostCurrency" AS "totalRaisedCurrency"
        FROM "Transactions" t1
        LEFT JOIN "Transactions" t2 
          ON t2."type" = 'DEBIT' 
          AND t2."kind" = t1."kind" 
          AND t1."TransactionGroup" = t2."TransactionGroup" 
          AND t2."deletedAt" IS NULL
        INNER JOIN "Hosts" h ON h."id" = t1."HostCollectiveId"
        WHERE t1."type" = 'CREDIT' 
          AND t1."kind" IN ('CONTRIBUTION', 'EXPENSE', 'ADDED_FUNDS')
          AND t1."deletedAt" IS NULL
          AND t1."RefundTransactionId" IS NULL
          AND t1."createdAt" > ${queryStartDate}
          AND t1."createdAt" < ${queryEndDate}
          AND (t2."HostCollectiveId" IS NULL OR t1."HostCollectiveId" != t2."HostCollectiveId")
        GROUP BY h."id", t1."hostCurrency"
      ),

      "AmountRaisedCrowdfunding" AS (
        SELECT h."id", COALESCE(SUM(t1."amountInHostCurrency"), 0) AS "totalRaised", 
              t1."hostCurrency" AS "totalRaisedCurrency"
        FROM "Transactions" t1
        LEFT JOIN "Transactions" t2 
          ON t2."type" = 'DEBIT' 
          AND t2."kind" = t1."kind" 
          AND t1."TransactionGroup" = t2."TransactionGroup" 
          AND t2."deletedAt" IS NULL
        INNER JOIN "Hosts" h ON h."id" = t1."HostCollectiveId"
        LEFT JOIN "PaymentMethods" pm ON pm."id" = t1."PaymentMethodId"
        WHERE t1."type" = 'CREDIT' 
          AND t1."kind" IN ('CONTRIBUTION', 'EXPENSE', 'ADDED_FUNDS')
          AND t1."deletedAt" IS NULL
          AND t1."RefundTransactionId" IS NULL
          AND t1."createdAt" > ${queryStartDate}
          AND t1."createdAt" < ${queryEndDate}
          AND (t2."HostCollectiveId" IS NULL OR t1."HostCollectiveId" != t2."HostCollectiveId")
          AND pm."service" IN ('stripe', 'paypal')
        GROUP BY h."id", t1."hostCurrency"
      ),

      "AmountRaisedNonCrowdfunding" AS (
        SELECT h."id", COALESCE(SUM(t1."amountInHostCurrency"), 0) AS "totalRaised", 
              t1."hostCurrency" AS "totalRaisedCurrency"
        FROM "Transactions" t1
        LEFT JOIN "Transactions" t2 
          ON t2."type" = 'DEBIT' 
          AND t2."kind" = t1."kind" 
          AND t1."TransactionGroup" = t2."TransactionGroup" 
          AND t2."deletedAt" IS NULL
        INNER JOIN "Hosts" h ON h."id" = t1."HostCollectiveId"
        LEFT JOIN "PaymentMethods" pm ON pm."id" = t1."PaymentMethodId"
        WHERE t1."type" = 'CREDIT' 
          AND t1."kind" IN ('CONTRIBUTION', 'EXPENSE', 'ADDED_FUNDS')
          AND t1."deletedAt" IS NULL
          AND t1."RefundTransactionId" IS NULL
          AND t1."createdAt" > ${queryStartDate}
          AND t1."createdAt" < ${queryEndDate}
          AND (t2."HostCollectiveId" IS NULL OR t1."HostCollectiveId" != t2."HostCollectiveId")
          AND (pm."service" IS NULL OR pm."service" NOT IN ('stripe', 'paypal'))
        GROUP BY h."id", t1."hostCurrency"
      ),

      "AmountDisbursed" AS (
        SELECT h."id", COALESCE(SUM(t1."amountInHostCurrency"), 0) AS "totalDisbursed", 
              t1."hostCurrency" AS "totalDisbursedCurrency"
        FROM "Transactions" t1
        LEFT JOIN "Transactions" t2 
          ON t2."type" = 'CREDIT' 
          AND t2."kind" = t1."kind" 
          AND t1."TransactionGroup" = t2."TransactionGroup" 
          AND t2."deletedAt" IS NULL
        INNER JOIN "Hosts" h ON h."id" = t1."HostCollectiveId"
        WHERE t1."type" = 'DEBIT' 
          AND t1."kind" IN ('CONTRIBUTION', 'EXPENSE', 'ADDED_FUNDS')
          AND t1."deletedAt" IS NULL
          AND t1."RefundTransactionId" IS NULL
          AND t1."createdAt" > ${queryStartDate}
          AND t1."createdAt" < ${queryEndDate}
          AND (t2."HostCollectiveId" IS NULL OR t1."HostCollectiveId" != t2."HostCollectiveId")
        GROUP BY h."id", t1."hostCurrency"
      ),

      "HostFees" AS (
        SELECT h."id", COALESCE(SUM(t."amountInHostCurrency"), 0) as "totalHostFees", t."hostCurrency" as "totalHostFeesCurrency"
        FROM "Transactions" t
        INNER JOIN "Hosts" h ON h."id" = t."CollectiveId"
        LEFT JOIN "Transactions" t2 ON t2."kind" = 'CONTRIBUTION'
          AND t2."TransactionGroup" = t."TransactionGroup"
          AND t2."deletedAt" IS NULL
          AND t2."type" = 'CREDIT'
        WHERE t."kind" = 'HOST_FEE'
          AND t."type" = 'CREDIT'
          AND t."deletedAt" IS NULL
          AND t."createdAt" > ${queryStartDate}
          AND t."createdAt" < ${queryEndDate}
        GROUP BY h."id", t."hostCurrency"
      ),

      "HostFeesCrowdfunding" AS (
        SELECT h."id", COALESCE(SUM(t."amountInHostCurrency"), 0) as "totalHostFees", t."hostCurrency" as "totalHostFeesCurrency"
        FROM "Transactions" t
        INNER JOIN "Hosts" h ON h."id" = t."CollectiveId"
        LEFT JOIN "Transactions" t2 ON t2."kind" = 'CONTRIBUTION'
          AND t2."TransactionGroup" = t."TransactionGroup"
          AND t2."deletedAt" IS NULL
          AND t2."type" = 'CREDIT'
        LEFT JOIN "PaymentMethods" pm ON pm."id" = t2."PaymentMethodId"
        WHERE t."kind" = 'HOST_FEE'
          AND t."type" = 'CREDIT'
          AND t."deletedAt" IS NULL
          AND t."createdAt" > ${queryStartDate}
          AND t."createdAt" < ${queryEndDate}
        AND pm."service" IN ('stripe', 'paypal')
        GROUP BY h."id", t."hostCurrency"
      ),

      "PlatformTips" AS (
        SELECT h."id", COALESCE(SUM(t."amountInHostCurrency"), 0) AS "totalPlatformTips", 
              t."hostCurrency"
        FROM "Transactions" t
        LEFT JOIN "Transactions" t2 
          ON t2."kind" = 'CONTRIBUTION'
          AND t2."TransactionGroup" = t."TransactionGroup"
          AND t2."deletedAt" IS NULL 
          AND t2."type" = 'CREDIT'
        INNER JOIN "Hosts" h ON h."id" = t2."HostCollectiveId"
        WHERE t."kind" = 'PLATFORM_TIP'
          AND t."type" = 'CREDIT'
          AND t."deletedAt" IS NULL
          AND t."createdAt" > ${queryStartDate}
          AND t."createdAt" < ${queryEndDate}
        GROUP BY h."id", t."hostCurrency"
      )

      SELECT h."id", h."slug", h."name", h."type", h."hostFeePercent", h."image",

        (h."data"->'plan'->>'platformTips')::boolean AS "platformTips",

        (EXISTS (
          SELECT 1
          FROM "Expenses"
          INNER JOIN "PaymentMethods" pm ON pm."id" = "Expenses"."PaymentMethodId"
          AND (
            (pm."service" = 'wise' AND pm."type" = 'bank_transfer')
            OR
            (pm."service" = 'paypal' AND pm."type" = 'payout')
          )
          WHERE "Expenses"."HostCollectiveId" = h."id"
          AND "Expenses"."status" = 'PAID'
          AND "Expenses"."deletedAt" IS NULL
          AND "Expenses"."createdAt" > ${queryStartDate}
          AND "Expenses"."createdAt" < ${queryEndDate}
        ))::boolean AS "automatedPayouts",

        (EXISTS (
          SELECT 1
          FROM "RequiredLegalDocuments"
          WHERE "HostCollectiveId" = h."id"
        ))::boolean AS "taxForms",

        COALESCE((
          SELECT COUNT(DISTINCT c."id")::INTEGER
          FROM "Collectives" c
          WHERE c."HostCollectiveId" = h."id"
            AND c."approvedAt" IS NOT NULL
            AND c."deletedAt" IS NULL
            AND c."ParentCollectiveId" IS NULL
            AND c."HostCollectiveId" != c."id"
          GROUP BY c."HostCollectiveId"
        ), 0) AS "totalCollectives",

        -- COALESCE((
        --   SELECT COUNT(e."id")::INTEGER
        --   FROM "Expenses" e
        --   INNER JOIN "Transactions" t ON t."ExpenseId" = e."id" AND t."kind" = 'EXPENSE' AND t."type" = 'DEBIT' AND t."RefundTransactionId" IS NULL AND t."deletedAt" IS NULL
        --   WHERE e."status" = 'PAID'
        --   AND t."createdAt" > '2024-01-01'
        --   AND t."createdAt" < '2025-01-01'
        --   AND t."HostCollectiveId" = h."id"
        --   AND e."deletedAt" IS NULL
        --   AND e."HostCollectiveId" = h."id"
        -- ), 0) AS "totalExpenses",

        (
          SELECT json_agg(
            json_build_object(
              'month', monthly_data.month_label,
              'count', monthly_data.active_collectives_count
            )
          )
          FROM (
            ${sql.join(
              monthDates.map(
                ({ monthLabel, startDate, endDate }) => sql`
                  SELECT 
                    ${sql.raw(`'${monthLabel}'`)} AS month_label,
                    COALESCE(COUNT(DISTINCT c."id")::INTEGER, 0) AS active_collectives_count
                  FROM "Collectives" c
                  INNER JOIN "Transactions" t ON t."CollectiveId" = c."id" 
                    AND t."deletedAt" IS NULL
                    AND t."createdAt" >= ${startDate}
                    AND t."createdAt" <= ${endDate}
                  WHERE c."HostCollectiveId" = h."id"
                    AND c."approvedAt" IS NOT NULL
                    AND c."deletedAt" IS NULL
                    AND c."ParentCollectiveId" IS NULL
                    AND c."HostCollectiveId" != c."id"
                `
              ),
              sql` UNION ALL `
            )}
          ) AS monthly_data
        ) AS "monthlyActiveCollectives",

        (
          SELECT json_agg(
            json_build_object(
              'month', monthly_data.month_label,
              'count', monthly_data.expense_count
            )
          )
          FROM (
            ${sql.join(
              monthDates.map(
                ({ monthLabel, startDate, endDate }) => sql`
                  SELECT 
                    ${sql.raw(`'${monthLabel}'`)} AS month_label,
                    COALESCE(COUNT(e."id")::INTEGER, 0) AS expense_count
                  FROM "Expenses" e
                  INNER JOIN "Transactions" t ON t."ExpenseId" = e."id" 
                    AND t."kind" = 'EXPENSE' 
                    AND t."type" = 'DEBIT' 
                    AND t."RefundTransactionId" IS NULL 
                    AND t."deletedAt" IS NULL
                  WHERE e."status" = 'PAID'
                    AND t."createdAt" >= ${startDate}
                    AND t."createdAt" <= ${endDate}
                    AND t."HostCollectiveId" = h."id"
                    AND e."deletedAt" IS NULL
                    AND e."HostCollectiveId" = h."id"
                `
              ),
              sql` UNION ALL `
            )}
          ) AS monthly_data
        ) AS "monthlyExpenses",

        COALESCE((
          SELECT ROUND(("totalRaised" * 
            COALESCE((SELECT "rate" 
                      FROM "CurrencyExchangeRates" 
                      WHERE "from" = ar."totalRaisedCurrency" 
                        AND "to" = 'USD' 
                      ORDER BY id DESC LIMIT 1), 1)
          )::NUMERIC, 0)::INTEGER
          FROM "AmountRaised" ar 
          WHERE ar."id" = h."id" 
          ORDER BY "totalRaised" DESC LIMIT 1
        ), 0) AS "totalRaisedUSD",

        COALESCE((
          SELECT ROUND(("totalRaised" * 
            COALESCE((SELECT "rate" 
                      FROM "CurrencyExchangeRates" 
                      WHERE "from" = ar."totalRaisedCurrency" 
                        AND "to" = 'USD' 
                      ORDER BY id DESC LIMIT 1), 1)
          )::NUMERIC, 0)::INTEGER
          FROM "AmountRaisedCrowdfunding" ar 
          WHERE ar."id" = h."id" 
          ORDER BY "totalRaised" DESC LIMIT 1
        ), 0) AS "totalRaisedCrowdfundingUSD",

        COALESCE((
          SELECT ROUND(("totalRaised" * 
            COALESCE((SELECT "rate" 
                      FROM "CurrencyExchangeRates" 
                      WHERE "from" = ar."totalRaisedCurrency" 
                        AND "to" = 'USD' 
                      ORDER BY id DESC LIMIT 1), 1)
          )::NUMERIC, 0)::INTEGER
          FROM "AmountRaisedNonCrowdfunding" ar 
          WHERE ar."id" = h."id" 
          ORDER BY "totalRaised" DESC LIMIT 1
        ), 0) AS "totalRaisedNonCrowdfundingUSD",

        COALESCE((
          SELECT ROUND(("totalDisbursed" * 
            COALESCE((SELECT "rate" 
                      FROM "CurrencyExchangeRates" 
                      WHERE "from" = ar."totalDisbursedCurrency" 
                        AND "to" = 'USD' 
                      ORDER BY id DESC LIMIT 1), 1)
          )::NUMERIC, 0)::INTEGER
          FROM "AmountDisbursed" ar 
          WHERE ar."id" = h."id" 
          ORDER BY "totalDisbursed" DESC LIMIT 1
        ), 0) AS "totalDisbursedUSD",

        COALESCE((
          SELECT "totalPlatformTips"::INTEGER
          FROM "PlatformTips" ar 
          WHERE ar."id" = h."id" 
          ORDER BY "totalPlatformTips" DESC 
          LIMIT 1
        ), 0) AS "totalPlatformTips",

       -- COALESCE((
       --   SELECT "totalHostFees"::INTEGER
       --   FROM "HostFees" ar
       --   WHERE ar."id" = h."id"
       --   ORDER BY "totalHostFees" DESC
       --   LIMIT 1
       -- ), 0) AS "totalHostFees",

       -- COALESCE((
       --   SELECT "totalHostFees"::INTEGER
       --   FROM "HostFeesCrowdfunding" ar
       --   WHERE ar."id" = h."id"
       --   ORDER BY "totalHostFees" DESC
       --   LIMIT 1
       -- ), 0) AS "totalHostFeesCrowdfunding",

        COALESCE((
          SELECT ROUND(("totalHostFees" *
            COALESCE((SELECT "rate"
                      FROM "CurrencyExchangeRates"
                      WHERE "from" = ar."totalHostFeesCurrency"
                        AND "to" = 'USD'
                      ORDER BY id DESC LIMIT 1), 1)
          )::NUMERIC, 0)::INTEGER
          FROM "HostFees" ar
          WHERE ar."id" = h."id"
          ORDER BY "totalHostFees" DESC LIMIT 1
        ), 0) AS "totalHostFeesUSD",

        COALESCE((
          SELECT ROUND(("totalHostFees" *
            COALESCE((SELECT "rate"
                      FROM "CurrencyExchangeRates"
                      WHERE "from" = ar."totalHostFeesCurrency"
                        AND "to" = 'USD'
                      ORDER BY id DESC LIMIT 1), 1)
          )::NUMERIC, 0)::INTEGER
          FROM "HostFeesCrowdfunding" ar
          WHERE ar."id" = h."id"
          ORDER BY "totalHostFees" DESC LIMIT 1
        ), 0) AS "totalHostFeesCrowdfundingUSD"

      FROM "Hosts" h`;

    const { rows } = await rawQuery.execute(db);

    // Calculate and log the query execution time
    const endTime = performance.now();
    const executionTimeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Query executed in ${executionTimeInSeconds} seconds`);

    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data from database");
  }
}

// Function to fetch a specific collective by slug
export async function fetchCollectiveBySlug(
  slug: string
): Promise<Host | null> {
  try {
    const data = await fetchData();

    if (slug === "oce") {
      return aggregateEurope(data);
    }
    const collective = data.find((item) => item.slug === slug);

    if (!collective) {
      console.warn(`Collective with slug "${slug}" not found`);
      return null;
    }

    return collective;
  } catch (error) {
    console.error(`Error fetching collective with slug "${slug}":`, error);
    return null;
  }
}

// Function to aggregate Europe data
export function aggregateEurope(data: Host[]): Host {
  const europe = data.find((item) => item.slug === "europe");
  const foundationUSD = data.find((item) => item.slug === "oce-foundation-usd");
  const foundationEUR = data.find((item) => item.slug === "oce-foundation-eur");

  if (!europe) {
    throw Error("Collective with slug europe not found");
  }

  function aggregateCollectives(collectives: (Host | undefined)[]) {
    // Aggregate monthly expenses across all collectives
    const allMonthlyExpenses = (collectives.filter(Boolean) as Host[]).reduce(
      (acc, collective) => {
        const expenses = collective.monthlyExpenses || [];
        expenses.forEach(({ month, count }) => {
          const existing = acc.find((e) => e.month === month);
          if (existing) {
            existing.count += count;
          } else {
            acc.push({ month, count });
          }
        });
        return acc;
      },
      [] as { month: string; count: number }[]
    );

    // Aggregate monthly active collectives across all collectives
    const allMonthlyActiveCollectives = (
      collectives.filter(Boolean) as Host[]
    ).reduce((acc, collective) => {
      const monthlyActiveCollectives =
        collective.monthlyActiveCollectives || [];
      monthlyActiveCollectives.forEach(({ month, count }) => {
        const existing = acc.find((e) => e.month === month);
        if (existing) {
          existing.count += count;
        } else {
          acc.push({ month, count });
        }
      });
      return acc;
    }, [] as { month: string; count: number }[]);

    // Aggregate other metrics
    const aggregatedMetrics = (collectives.filter(Boolean) as Host[]).reduce(
      (acc, collective) => ({
        totalCollectives:
          acc.totalCollectives + (collective.totalCollectives || 0),
        totalRaisedUSD: acc.totalRaisedUSD + (collective.totalRaisedUSD || 0),
        totalRaisedCrowdfundingUSD:
          acc.totalRaisedCrowdfundingUSD +
          (collective.totalRaisedCrowdfundingUSD || 0),
        totalRaisedNonCrowdfundingUSD:
          acc.totalRaisedNonCrowdfundingUSD +
          (collective.totalRaisedNonCrowdfundingUSD || 0),
        totalDisbursedUSD:
          acc.totalDisbursedUSD + (collective.totalDisbursedUSD || 0),
        totalPlatformTips:
          acc.totalPlatformTips + (collective.totalPlatformTips || 0),
        totalHostFeesUSD:
          acc.totalHostFeesUSD + (collective.totalHostFeesUSD || 0),
        totalHostFeesCrowdfundingUSD:
          acc.totalHostFeesCrowdfundingUSD +
          (collective.totalHostFeesCrowdfundingUSD || 0),
      }),
      {
        totalCollectives: 0,
        totalRaisedUSD: 0,
        totalRaisedCrowdfundingUSD: 0,
        totalRaisedNonCrowdfundingUSD: 0,
        totalDisbursedUSD: 0,
        totalPlatformTips: 0,
        totalHostFeesUSD: 0,
        totalHostFeesCrowdfundingUSD: 0,
      }
    );

    return {
      monthlyExpenses: allMonthlyExpenses,
      monthlyActiveCollectives: allMonthlyActiveCollectives,
      ...aggregatedMetrics,
    };
  }

  const aggregatedData = aggregateCollectives([
    europe,
    foundationUSD,
    foundationEUR,
  ]);

  return {
    ...europe,
    name: "Open Collective Europe (aggregate)",
    ...aggregatedData,
    automatedPayouts: true, // FIXME: to be made dynamic
    taxForms: true, // FIXME: to be made dynamic
  };
}
