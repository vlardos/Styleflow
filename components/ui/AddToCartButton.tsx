"use client";

import { useState } from "react";
import { useCart } from "@/lib/context/cart-context";

type Props = {
  productId: string;
};

export default function AddToCartButton({ productId }: Props) {
  const { isInCart, toggleItem } = useCart();
  const [busy, setBusy] = useState(false);
  const inCart = isInCart(productId);

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    try {
      await toggleItem(productId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={busy}
      className={`w-full py-4 text-[10px] uppercase tracking-[0.25em] transition-colors duration-200 ${
        inCart
          ? "bg-transparent border border-white/20 text-white/40 hover:border-white/40 hover:text-white/60"
          : "bg-white text-zinc-900 hover:bg-white/90 disabled:opacity-50"
      }`}
    >
      {busy ? "…" : inCart ? "Remove from Bag" : "Add to Bag"}
    </button>
  );
}
