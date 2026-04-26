"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/ui/TransitionLink";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type Props = {
  onClose: () => void;
};

export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? data))
      .catch(() => {});
  }, []);

  // Fade-in on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const results = trimmed
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmed) ||
            p.category.toLowerCase().includes(trimmed)
        )
        .slice(0, 6)
    : [];

  function handleLinkClick() {
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-white flex flex-col transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
        <span className="text-xs uppercase tracking-widest text-zinc-400">
          Search
        </span>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 transition-colors text-2xl leading-none"
          aria-label="Close search"
        >
          &#x2715;
        </button>
      </div>

      {/* Input */}
      <div className="flex justify-center px-8 pt-12 pb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pieces..."
          autoFocus
          className="font-serif text-3xl font-light border-b border-zinc-200 w-full max-w-2xl mx-auto outline-none pb-3 text-zinc-900 placeholder-zinc-300 bg-transparent"
        />
      </div>

      {/* Results */}
      <div className="w-full max-w-2xl mx-auto px-8 flex-1 overflow-y-auto">
        {!trimmed && (
          <p className="text-xs uppercase tracking-widest text-zinc-400 pt-2">
            Type to search...
          </p>
        )}

        {trimmed && results.length === 0 && (
          <p className="text-xs uppercase tracking-widest text-zinc-400 pt-2">
            No pieces found
          </p>
        )}

        {results.map((product) => (
          <TransitionLink
            key={product.id}
            href={`/catalog/${product.id}`}
            className="border-b border-zinc-100 py-3 flex justify-between items-center hover:text-zinc-900 text-zinc-700 transition-colors cursor-pointer"
            onClick={handleLinkClick}
          >
            <span className="font-serif text-lg font-light">{product.name}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 ml-4">
              ${product.price.toFixed(2)}
            </span>
          </TransitionLink>
        ))}
      </div>
    </div>
  );
}
