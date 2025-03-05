import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Get the workspace root directory
const rootDir = path.resolve(__dirname, "..");
const envFilePath = path.join(rootDir, ".env");

// Function to check if we're running on Vercel
function isRunningOnVercel() {
  return process.env.VERCEL === "1";
}

// Main function to run the setup
async function main() {
  try {
    console.log("Setting up environment for build...");

    // Check if we're on Vercel
    if (isRunningOnVercel()) {
      console.log("Running on Vercel, setting up temporary .env file");

      // Get DATABASE_URL from environment variable
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        console.error("DATABASE_URL environment variable is not set!");
        process.exit(1);
      }

      // Create a temporary .env file with the DATABASE_URL
      fs.writeFileSync(envFilePath, `DATABASE_URL=${databaseUrl}\n`);
      console.log("Created temporary .env file with DATABASE_URL");

      // Run kysely-codegen
      console.log("Running kysely-codegen...");
      execSync("npx kysely-codegen", { stdio: "inherit" });

      // Clean up
      fs.unlinkSync(envFilePath);
      console.log("Removed temporary .env file");
    } else {
      // Just run kysely-codegen normally in local environment
      console.log("Running kysely-codegen in local environment...");
      execSync("npx kysely-codegen", { stdio: "inherit" });
    }

    console.log("Environment setup completed successfully");
  } catch (error) {
    console.error("Error setting up environment:", error);
    process.exit(1);
  }
}

main();
