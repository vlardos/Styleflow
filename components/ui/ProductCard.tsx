"use client";

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
  onToggle: (id: string) => void;
};

export default function ProductCard({ product, inCart, onToggle }: Props) {
  return (
    <TransitionLink href={`/catalog/${product.id}`} className="block group relative bg-white">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          imageQuery={product.imageQuery}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          {product.category}
        </p>
        <p className="text-sm text-zinc-900 mt-1 group-hover:underline underline-offset-2 decoration-zinc-400">
          {product.name}
        </p>
        <p className="text-sm text-zinc-500">${product.price.toFixed(2)}</p>
      </div>

      {/* Add to Bag — visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggle(product.id); }}
        className={`mt-3 w-full border text-xs uppercase tracking-widest py-2.5 transition-colors duration-200
          opacity-0 group-hover:opacity-100
          ${
            inCart
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-900 bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white"
          }`}
      >
        {inCart ? "Remove" : "Add to Bag"}
      </button>
    </TransitionLink>
  );
}
