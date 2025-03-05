#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

/**
 * This script creates sample data files for development and testing purposes.
 * It's useful when you don't have a database connection but want to test the app.
 */

// Sample data for Collectives
const sampleCollectivesData = [
  {
    id: 1,
    name: "Open Source Collective",
    slug: "opensource",
    description: "Supporting open source projects",
    image: "https://example.com/images/opensource.jpg",
    currency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paidExpensesCount: "42",
  },
  {
    id: 2,
    name: "Climate Action Collective",
    slug: "climate-action",
    description: "Fighting climate change together",
    image: "https://example.com/images/climate.jpg",
    currency: "EUR",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paidExpensesCount: "15",
  },
  {
    id: 3,
    name: "Tech Education Fund",
    slug: "tech-education",
    description: "Making tech education accessible to all",
    image: "https://example.com/images/education.jpg",
    currency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paidExpensesCount: "28",
  },
];

// Main function to create sample data files
async function main() {
  try {
    // Create the data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save the sample Collectives data
    fs.writeFileSync(
      path.join(dataDir, "collectives.json"),
      JSON.stringify(sampleCollectivesData, null, 2)
    );
    console.log("Sample Collectives data saved to data/collectives.json");

    console.log("All sample data files created successfully!");
  } catch (error) {
    console.error("Error creating sample data:", error);
    process.exit(1);
  }
}

// Run the main function
main();
