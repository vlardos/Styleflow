"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import ProductCard, {
  type ProductCardProduct,
} from "@/components/ui/ProductCard";

type Product = ProductCardProduct & {
  season: string[];
};

const CATEGORIES = ["tops", "bottoms", "outerwear", "dresses", "footwear", "accessories"];
const STYLES = ["casual", "formal", "minimalist"];
const SEASONS = ["spring", "summer", "autumn", "winter"];

export default function CatalogPage() {
  const router = useRouter();
  const { items: cart, toggleItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [season, setSeason] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category) result = result.filter((p) => p.category === category);
    if (style) result = result.filter((p) => p.style === style);
    if (season) result = result.filter((p) => p.season.includes(season));

    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    if (sort === "desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, search, category, style, season, sort]);

  function goToOrder() {
    const params = new URLSearchParams();
    cart.forEach((id) => params.append("items", id));
    router.push(`/order?${params.toString()}`);
  }

  const cartTotal = products
    .filter((p) => cart.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-screen-xl mx-auto px-6 py-12">

        {/* Header row */}
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
              The Collection
            </p>
            <p className="text-xs text-zinc-400">
              {loading ? "Loading..." : `${filtered.length} pieces`}
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={goToOrder}
              className="border border-zinc-900 text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-zinc-900 hover:text-white transition-colors duration-200"
            >
              Checkout &middot; {cart.length} &middot; ${cartTotal.toFixed(2)}
            </button>
          )}
        </div>

        {/* Filter section */}
        <div className="mb-10 space-y-4">

          {/* Search */}
          <div className="relative max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pieces..."
              className="w-full border-b border-zinc-200 bg-transparent text-sm py-2 pr-8 outline-none placeholder:text-zinc-400 focus:border-zinc-900 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-0 top-2 text-zinc-400 hover:text-zinc-900 text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Category row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-300 mr-2 w-16">Category</span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? "" : c)}
                className={`px-3 py-1 text-xs uppercase tracking-widest border transition-all duration-150 ${
                  category === c
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Style row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-zinc-300 mr-2 w-16">Style</span>
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(style === s ? "" : s)}
                className={`px-3 py-1 text-xs uppercase tracking-widest border transition-all duration-150 ${
                  style === s
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Season + Sort row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-zinc-300 mr-2 w-16">Season</span>
              {SEASONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(season === s ? "" : s)}
                  className={`px-3 py-1 text-xs uppercase tracking-widest border transition-all duration-150 ${
                    season === s
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-zinc-300 mr-1">Price</span>
              {[
                { value: "",     label: "—"  },
                { value: "asc",  label: "↑"  },
                { value: "desc", label: "↓"  },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`w-8 h-8 text-xs border transition-all duration-150 ${
                    sort === opt.value
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters summary + clear */}
          {(category || style || season || search || sort) && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-zinc-400">{filtered.length} results</span>
              <button
                onClick={() => { setCategory(""); setStyle(""); setSeason(""); setSearch(""); setSort(""); }}
                className="text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Product grid */}
        {fetchError ? (
          <div className="py-20 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Failed to load collection
            </p>
            <button
              onClick={() => { setFetchError(false); setLoading(true); fetch("/api/products").then(r => r.json()).then(data => setProducts(data.products ?? [])).catch(() => setFetchError(true)).finally(() => setLoading(false)); }}
              className="mt-4 text-xs uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-100" />
                <div className="h-3 bg-zinc-100 mt-4 w-1/2 rounded" />
                <div className="h-3 bg-zinc-100 mt-2 w-3/4 rounded" />
                <div className="h-3 bg-zinc-100 mt-1 w-1/4 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              No pieces match your filters
            </p>
            {(search || category || style || season) && (
              <button
                onClick={() => { setSearch(""); setCategory(""); setStyle(""); setSeason(""); }}
                className="mt-4 text-xs uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={cart.includes(p.id)}
                onToggle={toggleItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed checkout bar — only when cart is not empty */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-4 flex items-center justify-between z-50">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {cart.length} {cart.length === 1 ? "item" : "items"} selected
          </p>
          <button
            onClick={goToOrder}
            className="bg-zinc-900 text-white text-xs uppercase tracking-widest px-8 py-3 hover:bg-zinc-700 transition-colors duration-200"
          >
            Checkout &middot; ${cartTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
