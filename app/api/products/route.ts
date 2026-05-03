import { getAllProductsFromDb, getAllProducts } from '@/lib/services/product.service';
import { NextResponse } from 'next/server';

const CACHE_HEADERS = {
  'Cache-Control': process.env.NODE_ENV === 'production'
    ? 'public, max-age=300, stale-while-revalidate=3600'
    : 'no-store',
};

export async function GET() {
  try {
    const products = await getAllProductsFromDb();
    return NextResponse.json({ success: true, products }, { headers: CACHE_HEADERS });
  } catch {
    // Fallback to static JSON if DB is unavailable
    const products = getAllProducts();
    return NextResponse.json({ success: true, products }, { headers: CACHE_HEADERS });
  }
}
