import products from '../data/products.json';

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

  // Same category first, excluding self
  const sameCategory = all.filter(
    (p) => p.id !== id && p.category === current.category
  );

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  // Fill up with same style
  const sameStyle = all.filter(
    (p) => p.id !== id && p.style === current.style && p.category !== current.category
  );

  return [...sameCategory, ...sameStyle].slice(0, limit);
}
