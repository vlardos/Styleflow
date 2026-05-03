import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PICS_DIR = path.join(ROOT, "pics");
const OUT_DIR = path.join(ROOT, "public", "products");
const JSON_PATH = path.join(ROOT, "lib", "data", "products.json");

// Ensure output dir exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Load products
const products = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

// Get all files in pics/
const picFiles = fs.readdirSync(PICS_DIR).filter((f) =>
  /\.(jpg|jpeg|png|webp|avif)$/i.test(f)
);

let updated = 0;

for (const file of picFiles) {
  const nameWithoutExt = path.basename(file, path.extname(file)).toLowerCase().trim();

  // Find matching product by name (case-insensitive)
  const product = products.find(
    (p) => p.name.toLowerCase().trim() === nameWithoutExt
  );

  if (!product) {
    console.log(`⚠  No match found for: "${file}"`);
    continue;
  }

  const ext = path.extname(file);
  const destName = `${product.id}${ext}`;
  const srcPath = path.join(PICS_DIR, file);
  const destPath = path.join(OUT_DIR, destName);

  fs.copyFileSync(srcPath, destPath);

  product.image = `/products/${destName}`;
  delete product.imageQuery; // local image — no need for fallback query

  console.log(`✓  ${file} → /products/${destName} (${product.id}: ${product.name})`);
  updated++;
}

// Save updated JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2));

console.log(`\n${updated} product(s) updated.`);
