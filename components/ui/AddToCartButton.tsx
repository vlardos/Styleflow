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
      className={`w-full py-4 text-xs uppercase tracking-widest transition-colors duration-200
        ${
          inCart
            ? "bg-zinc-100 text-zinc-500 cursor-default"
            : "bg-zinc-900 text-white hover:bg-zinc-700"
        }`}
    >
      {inCart ? "Added to Bag" : "Add to Bag"}
    </button>
  );
}
