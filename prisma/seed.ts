import path from "path";
import { fileURLToPath } from "url";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../lib/generated/prisma";
import products from "../lib/data/products.json";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];
const DEFAULT_STOCK = 100;

// Use absolute path so the script works from any working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbUrl = `file:${path.resolve(__dirname, "../dev.db")}`;

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing products first
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: JSON.stringify([p.image]),
        sizes: JSON.stringify(DEFAULT_SIZES),
        stock: DEFAULT_STOCK,
        season: JSON.stringify(p.season),
        weather: p.weather,
        tags: JSON.stringify(p.tags),
        style: p.style,
      },
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
