"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import TransitionLink from "@/components/ui/TransitionLink";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

// Module-level cache: fetched once per browser session, reused on every open
let _productsCache: Product[] | null = null;
let _fetchPromise: Promise<Product[]> | null = null;

function getProducts(): Promise<Product[]> {
  if (_productsCache) return Promise.resolve(_productsCache);
  if (_fetchPromise) return _fetchPromise;
  _fetchPromise = fetch("/api/products")
    .then((r) => r.json())
    .then((data) => {
      _productsCache = data.products ?? [];
      _fetchPromise = null;
      return _productsCache!;
    })
    .catch(() => {
      _fetchPromise = null;
      return [] as Product[];
    });
  return _fetchPromise;
}

type Props = {
  onClose: () => void;
};

export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(_productsCache ?? []);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (_productsCache) return; // already loaded
    getProducts().then((list) => setProducts(list));
  }, []);

  // Fade-in on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 60);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 320);
  }, [onClose]);

  // Esc key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const trimmed = query.trim().toLowerCase();

  const results = trimmed
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmed) ||
            p.category.toLowerCase().includes(trimmed)
        )
        .slice(0, 7)
    : [];

  const opacity = closing ? 0 : visible ? 1 : 0;
  const translateY = closing ? "-10px" : "0px";
  const transition = visible
    ? "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"
    : "opacity 200ms ease";

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col"
      style={{ opacity, transform: `translateY(${translateY})`, transition }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/6 shrink-0">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/25">
          Search
        </span>
        <button
          onClick={handleClose}
          aria-label="Close search"
          className="w-8 h-8 flex items-center justify-center text-white/25 hover:text-white/70 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l12 12M14 2L2 14"/>
          </svg>
        </button>
      </div>

      {/* Input */}
      <div className="px-6 lg:px-12 pt-10 pb-6 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pieces..."
          className="font-serif w-full max-w-2xl bg-transparent outline-none text-white/80 placeholder:text-white/15 border-b border-white/10 pb-4 focus:border-white/25 transition-colors"
          style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 300 }}
        />
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-12 pb-6">

        {!trimmed && (
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/15 pt-2">
            Type to search the collection
          </p>
        )}

        {trimmed && results.length === 0 && (
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/15 pt-2">
            No pieces found
          </p>
        )}

        {results.length > 0 && (
          <div className="max-w-2xl border-t border-white/6">
            {results.map((product, i) => (
              <TransitionLink
                key={product.id}
                href={`/catalog/${product.id}`}
                onClick={handleClose}
                className="group border-b border-white/6 py-5 flex items-center justify-between gap-6 hover:pl-1 transition-all duration-300"
              >
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="text-[9px] text-white/15 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-lg lg:text-xl font-light text-white/60 group-hover:text-white/90 transition-colors truncate">
                    {product.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
                    {product.category}
                  </span>
                  <span className="text-sm text-white/30 tabular-nums font-light">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
