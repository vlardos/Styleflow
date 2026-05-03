"use client";

import { useState } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import ProductImage from "@/components/ui/ProductImage";

export type ProductCardProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  imageQuery?: string;
  tags: string[];
  style: string;
};

type Props = {
  product: ProductCardProduct;
  inCart: boolean;
  onToggle: (id: string) => Promise<void>;
};

export default function ProductCard({ product, inCart, onToggle }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await onToggle(product.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <TransitionLink href={`/catalog/${product.id}`} className="block group relative">

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        <ProductImage
          src={product.image}
          alt={product.name}
          imageQuery={product.imageQuery}
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Dark gradient — always subtle, deeper on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top-right: in-cart dot */}
        {inCart && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
            <span className="text-[8px] uppercase tracking-[0.2em] text-white/60">In bag</span>
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        )}

        {/* Mobile: luxury strip CTA */}
        <button
          onClick={handleToggle}
          disabled={busy}
          className={`lg:hidden absolute bottom-0 left-0 right-0 h-11 flex items-center justify-center gap-2 transition-all duration-500 disabled:opacity-50 ${
            inCart
              ? "bg-black/55 backdrop-blur-md border-t border-white/10"
              : "bg-white/92 backdrop-blur-sm"
          }`}
        >
          {busy ? (
            <span className="text-[8px] uppercase tracking-[0.35em] text-white/40">…</span>
          ) : inCart ? (
            <span className="text-[8px] uppercase tracking-[0.35em] text-white/55 flex items-center gap-1.5">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 2l6 6M8 2L2 8"/>
              </svg>
              Remove
            </span>
          ) : (
            <span className="text-[8px] uppercase tracking-[0.35em] text-zinc-800">Add to Bag</span>
          )}
        </button>

        {/* Bottom info revealed on hover — desktop only */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out hidden lg:flex">

          {/* Tags row */}
          <div className="flex gap-1.5 flex-wrap">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[8px] uppercase tracking-[0.2em] text-white/40 border border-white/15 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>

          {/* Add / Remove button */}
          <button
            onClick={handleToggle}
            disabled={busy}
            className={`w-full text-[10px] uppercase tracking-[0.25em] py-3 transition-all duration-300 disabled:opacity-50 ${
              inCart
                ? "bg-white/15 backdrop-blur-sm border border-white/30 text-white/70 hover:bg-white/5 hover:text-white/40"
                : "bg-white text-zinc-900 hover:bg-white/90"
            }`}
          >
            {busy ? "…" : inCart ? "Remove from Bag" : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Info below image */}
      <div className="mt-4">

        {/* Category + price on same line */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[8px] uppercase tracking-[0.35em] text-white/25">
            {product.category}
          </p>
          <p className="text-[11px] text-white/35 font-light tabular-nums">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Name with animated underline */}
        <p className="relative text-[13px] text-white/70 font-light leading-snug group-hover:text-white transition-colors duration-400 inline-block">
          {product.name}
          <span className="absolute bottom-0 left-0 w-full h-px bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
        </p>

        {/* Desktop: always-visible remove button below image when in cart */}
        {inCart && (
          <button
            onClick={handleToggle}
            disabled={busy}
            className="hidden lg:flex items-center gap-1.5 mt-2.5 text-[8px] uppercase tracking-[0.25em] text-white/25 hover:text-white/70 transition-colors duration-300 disabled:opacity-40"
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2l6 6M8 2L2 8"/>
            </svg>
            {busy ? "…" : "Remove"}
          </button>
        )}

      </div>
    </TransitionLink>
  );
}
