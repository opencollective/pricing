import { Pool } from "pg";

// Create a new Pool instance for connecting to the PostgreSQL database
// Configure connection parameters via environment variables for security
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  database: process.env.POSTGRES_DATABASE,
  ssl: {
    rejectUnauthorized: false, // Required for some hosted PostgreSQL services
  },
});

// Function to query the database
export async function query(text: string, params?: unknown[]) {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}

// Function to get a single client from the pool
export async function getClient() {
  const client = await pool.connect();
  return client;
}
