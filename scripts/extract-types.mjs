import fs from "fs";

const srcPath = process.argv[2];
if (!srcPath) {
  console.error("Usage: node scripts/extract-types.mjs <tool-result-json-path>");
  process.exit(1);
}
const raw = fs.readFileSync(srcPath, "utf8");
const parsed = JSON.parse(raw);
const text = parsed[0].text;
const inner = JSON.parse(text);
fs.mkdirSync("src/types", { recursive: true });
fs.writeFileSync("src/types/database.ts", inner.types);
console.log("written", inner.types.length, "chars");
