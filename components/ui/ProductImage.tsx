"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  imageQuery?: string;
  className?: string;
  sizes?: string;
};

export default function ProductImage({ src, alt, imageQuery, className, sizes }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-3 p-6">
        <div className="w-10 h-px bg-white/20" />
        <p className="text-[10px] uppercase tracking-widest text-white/25 text-center leading-relaxed">
          {imageQuery ?? alt}
        </p>
        <div className="w-10 h-px bg-white/20" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"}
      className={className}
      onError={() => setError(true)}
    />
  );
}
