import products from '../data/products.json';
import { prisma } from '../prisma';

// ─── Types ────────────────────────────────────────────────────────────────────

// Shape of a raw row coming back from Prisma (arrays stored as JSON strings)
type DbRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;  // JSON: ["url1"]
  sizes: string;   // JSON: ["XS","S","M","L","XL"]
  stock: number;
  season: string;  // JSON: ["spring","summer"]
  weather: string;
  tags: string;    // JSON: ["casual","everyday"]
  style: string;
};

// Normalized shape used by the UI and API responses
export type NormalizedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;        // images[0] — kept for UI backward compat
  imageQuery?: string;  // not stored in DB; undefined is fine
  images: string[];
  sizes: string[];
  tags: string[];
  season: string[];
  weather: string;
  style: string;
  stock: number;
};

// Legacy type still used by AI tools (search, weather, recommend)
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  season: string[];
  weather: string;
  tags: string[];
  style: string;
  image: string;
  imageQuery?: string;
  description?: string;
};

// ─── Normalize ────────────────────────────────────────────────────────────────

function safeParseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizeRow(row: DbRow): NormalizedProduct {
  const images = safeParseJson<string[]>(row.images, []);
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: images[0] ?? '',
    images,
    sizes: safeParseJson<string[]>(row.sizes, []),
    tags: safeParseJson<string[]>(row.tags, []),
    season: safeParseJson<string[]>(row.season, []),
    weather: row.weather,
    style: row.style,
    stock: row.stock,
  };
}

// ─── Async DB functions ───────────────────────────────────────────────────────

export async function getAllProductsFromDb(): Promise<NormalizedProduct[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  return rows.map(normalizeRow);
}

export async function getProductByIdFromDb(id: string): Promise<NormalizedProduct | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  if (!row) return null;
  return normalizeRow(row);
}

export async function getRelatedProductsFromDb(id: string, limit = 3): Promise<NormalizedProduct[]> {
  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) return [];

  const sameCategory = await prisma.product.findMany({
    where: { category: current.category, id: { not: id } },
    take: limit,
  });

  if (sameCategory.length >= limit) return sameCategory.map(normalizeRow);

  const needed = limit - sameCategory.length;
  const sameStyle = await prisma.product.findMany({
    where: { style: current.style, id: { not: id }, NOT: { category: current.category } },
    take: needed,
  });

  return [...sameCategory, ...sameStyle].map(normalizeRow);
}

// ─── Sync JSON fallbacks (used by AI tools) ───────────────────────────────────

export function getAllProducts(): Product[] {
  return products as Product[];
}

export function getProductById(id: string): Product | undefined {
  return (products as Product[]).find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return (products as Product[]).filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}

export function filterByWeather(weather: string): Product[] {
  return (products as Product[]).filter(
    (p) => p.weather === weather || p.weather === 'any'
  );
}

export function getRelatedProducts(id: string, limit = 3): Product[] {
  const current = getProductById(id);
  if (!current) return [];

  const all = products as Product[];
  const sameCategory = all.filter((p) => p.id !== id && p.category === current.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const sameStyle = all.filter(
    (p) => p.id !== id && p.style === current.style && p.category !== current.category
  );
  return [...sameCategory, ...sameStyle].slice(0, limit);
}
