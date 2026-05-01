"use client";

import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";

type Props = {
  productId: string;
  price: number;
};

export default function MobileCartCTA({ productId, price }: Props) {
  const { isInCart, toggleItem } = useCart();
  const inCart = isInCart(productId);
  const [flash, setFlash] = useState(false);

  function handleAdd() {
    toggleItem(productId);
    if (!inCart) {
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
    }
  }

  return (
    <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 border-t border-white/8 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="flex items-center" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>

        {/* Price */}
        <div className="px-6 py-5 shrink-0">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 mb-1">Price</p>
          <p className="text-base font-light text-white/60 tabular-nums">${price.toFixed(2)}</p>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/6 shrink-0" />

        {/* Button */}
        <button
          onClick={handleAdd}
          className={`flex-1 relative overflow-hidden flex items-center justify-center gap-2.5 py-5 px-6 transition-all duration-500 ${
            inCart ? "active:scale-[0.98]" : "active:scale-[0.98]"
          }`}
        >
          {/* Flash shimmer overlay */}
          {flash && (
            <span className="absolute inset-0 bg-white/5 animate-fade-in" />
          )}

          {inCart ? (
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white/60 transition-colors">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <polyline points="2,7 6,11 12,3"/>
              </svg>
              Remove from Bag
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors">
              Add to Bag
            </span>
          )}

          {/* Active state indicator — thin white top border on hover */}
          {!inCart && (
            <span className="absolute top-0 left-6 right-6 h-px bg-white/10" />
          )}
        </button>
      </div>
    </div>
  );
}
