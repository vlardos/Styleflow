"use client";

import { useCart } from "@/lib/hooks/useCart";

type Props = {
  productId: string;
};

export default function AddToCartButton({ productId }: Props) {
  const { isInCart, addItem } = useCart();
  const inCart = isInCart(productId);

  return (
    <button
      onClick={() => !inCart && addItem(productId)}
      className={`w-full py-4 text-[10px] uppercase tracking-[0.25em] transition-colors duration-200
        ${
          inCart
            ? "bg-white/8 text-white/30 cursor-default border border-white/10"
            : "bg-white text-zinc-900 hover:bg-white/90"
        }`}
    >
      {inCart ? "Added to Bag" : "Add to Bag"}
    </button>
  );
}
