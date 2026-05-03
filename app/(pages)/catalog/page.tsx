"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/cart-context";
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
  const { isInCart, toggleItem, itemCount, subtotal } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const loadProducts = useCallback(() => {
    setFetchError(false);
    setLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [season, setSeason] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => { loadProducts(); }, [loadProducts]);

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
    router.push("/order");
  }

  const filterBtnClass = (active: boolean) =>
    `px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-all duration-200 ${
      active
        ? "border-white/60 text-white bg-white/10"
        : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
    }`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">

        {/* Page header */}
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-4">
            StyleFlow
          </p>
          <div className="flex items-end justify-between">
            <h1 className="font-serif font-light text-5xl md:text-7xl text-white/90 leading-none">
              The Collection
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-2">
              {loading ? "—" : `${filtered.length} pieces`}
            </p>
          </div>
          <div className="mt-6 h-px bg-white/8" />
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-4">

          {/* Search */}
          <div className="relative max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pieces..."
              className="w-full border-b border-white/10 bg-transparent text-sm py-2.5 pr-8 outline-none placeholder:text-white/20 text-white/70 focus:border-white/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-0 top-2.5 text-white/30 hover:text-white/70 text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category — horizontal scroll */}
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-2">Category</span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(category === c ? "" : c)} className={`${filterBtnClass(category === c)} shrink-0`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Style + Season — two rows, horizontal scroll */}
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-2">Style</span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(style === s ? "" : s)} className={`${filterBtnClass(style === s)} shrink-0`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-2">Season</span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SEASONS.map((s) => (
                  <button key={s} onClick={() => setSeason(season === s ? "" : s)} className={`${filterBtnClass(season === s)} shrink-0`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pb-1 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Price</span>
              {[
                { value: "",     label: "—" },
                { value: "asc",  label: "↑" },
                { value: "desc", label: "↓" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`w-8 h-8 text-xs border transition-all duration-200 ${
                    sort === opt.value
                      ? "border-white/60 text-white bg-white/10"
                      : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {(category || style || season || search || sort) && (
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[10px] text-white/20">{filtered.length} results</span>
              <button
                onClick={() => { setCategory(""); setStyle(""); setSeason(""); setSearch(""); setSort(""); }}
                className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/70 transition-colors border-b border-white/10 hover:border-white/40 pb-0.5"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {fetchError ? (
          <div className="py-32 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
              Failed to load collection
            </p>
            <button
              onClick={loadProducts}
              className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/20 pb-0.5 hover:text-white/80 hover:border-white/50 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/5" />
                <div className="h-2 bg-white/5 mt-4 w-1/3 rounded" />
                <div className="h-2 bg-white/5 mt-2 w-2/3 rounded" />
                <div className="h-2 bg-white/5 mt-1 w-1/4 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
              No pieces match your selection
            </p>
            {(search || category || style || season) && (
              <button
                onClick={() => { setSearch(""); setCategory(""); setStyle(""); setSeason(""); }}
                className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/20 pb-0.5 hover:text-white/80 hover:border-white/50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={isInCart(p.id)}
                onToggle={toggleItem}
              />
            ))}
          </div>
        )}

        {/* Bottom padding for checkout bar + bottom nav */}
        {itemCount > 0 && <div className="h-36 lg:h-24" />}
      </div>

      {/* Checkout bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#0a0a0a]/95 backdrop-blur-md px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-white/30">
              Selected
            </p>
            <p className="text-sm font-light text-white/70 mt-0.5">
              {itemCount} {itemCount === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <button
            onClick={goToOrder}
            className="bg-white text-zinc-900 text-[10px] uppercase tracking-[0.25em] px-10 py-3.5 hover:bg-white/90 transition-colors duration-200 font-medium"
          >
            Checkout &middot; ${subtotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
