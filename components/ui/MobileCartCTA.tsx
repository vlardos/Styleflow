"use client";

import { useCart } from "@/lib/hooks/useCart";

type Props = {
  productId: string;
  price: number;
};

export default function MobileCartCTA({ productId, price }: Props) {
  const { isInCart, addItem } = useCart();
  const inCart = isInCart(productId);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-100 px-6 py-4 flex items-center gap-4">
      <p className="text-sm text-zinc-500">${price.toFixed(2)}</p>
      <button
        onClick={() => !inCart && addItem(productId)}
        className={`flex-1 py-3.5 text-xs uppercase tracking-widest transition-colors duration-200 ${
          inCart
            ? "bg-zinc-100 text-zinc-500 cursor-default"
            : "bg-zinc-900 text-white hover:bg-zinc-700"
        }`}
      >
        {inCart ? "Added to Bag" : "Add to Bag"}
      </button>
    </div>
  );
}
