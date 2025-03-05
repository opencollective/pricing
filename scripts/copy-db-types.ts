import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source file in node_modules
const sourceFilePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "kysely-codegen",
  "dist",
  "db.d.ts"
);

// Destination directory and file
const destDir = path.join(__dirname, "..", "app", "lib");
const destFilePath = path.join(destDir, "db.d.ts");

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  // Read and copy the file
  const fileContent = fs.readFileSync(sourceFilePath, "utf8");
  fs.writeFileSync(destFilePath, fileContent, "utf8");
  console.log(`Successfully copied DB types to ${destFilePath}`);
} catch (error) {
  console.error("Error copying DB types:", error);
  process.exit(1);
}
