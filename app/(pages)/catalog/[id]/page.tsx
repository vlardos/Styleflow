import TransitionLink from "@/components/ui/TransitionLink";
import ProductImage from "@/components/ui/ProductImage";
import AddToCartButton from "@/components/ui/AddToCartButton";
import MobileCartCTA from "@/components/ui/MobileCartCTA";
import { getProductById, getRelatedProducts } from "@/lib/services/product.service";
import type { Product } from "@/lib/services/product.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id) ?? null;

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Product not found
        </p>
        <TransitionLink
          href="/catalog"
          className="text-xs uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
        >
          Back to Collection
        </TransitionLink>
      </div>
    );
  }

  const related = getRelatedProducts(id);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-24 lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-400 mb-10">
          <TransitionLink href="/catalog" className="hover:text-zinc-900 transition-colors">
            Collection
          </TransitionLink>
          <span>/</span>
          <TransitionLink
            href={`/catalog?category=${product.category}`}
            className="hover:text-zinc-900 transition-colors capitalize"
          >
            {product.category}
          </TransitionLink>
          <span>/</span>
          <span className="text-zinc-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — image */}
          <div className="relative aspect-[3/4] w-full bg-zinc-50 overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              imageQuery={product.imageQuery}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Right — info */}
          <div className="flex flex-col lg:py-4">

            {/* Category + name */}
            <p className="text-[11px] uppercase tracking-widest text-zinc-400">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-light mt-3 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl text-zinc-500 mt-5 font-light">
              ${product.price.toFixed(2)}
            </p>

            <div className="w-12 h-px bg-zinc-200 my-8" />

            {/* Description */}
            {product.description && (
              <p className="text-sm text-zinc-500 leading-loose max-w-sm">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest px-3 py-1 border border-zinc-200 text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-zinc-100 my-8" />

            {/* CTA — hidden on mobile (sticky bar handles it) */}
            <div className="hidden lg:block">
              <AddToCartButton productId={product.id} />
            </div>

            {/* Meta */}
            <p className="text-[11px] uppercase tracking-widest text-zinc-400 mt-6">
              Style: {product.style}
              {product.season.length > 0 && (
                <> &middot; Season: {product.season.join(", ")}</>
              )}
            </p>

          </div>
        </div>

        {/* Complete the Look */}
        {related.length > 0 && (
          <section className="mt-24 lg:mt-32">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-serif text-2xl font-light">Complete the Look</h2>
              <TransitionLink
                href="/catalog"
                className="text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors border-b border-zinc-300 pb-0.5"
              >
                View All
              </TransitionLink>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
              {related.map((item: Product) => (
                <TransitionLink
                  key={item.id}
                  href={`/catalog/${item.id}`}
                  className="block group"
                >
                  <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      imageQuery={item.imageQuery}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-[11px] uppercase tracking-widest text-zinc-400">
                      {item.category}
                    </p>
                    <p className="text-sm text-zinc-900 mt-1 group-hover:underline underline-offset-2 decoration-zinc-400">
                      {item.name}
                    </p>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </TransitionLink>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Sticky mobile CTA */}
      <MobileCartCTA productId={product.id} price={product.price} />
    </div>
  );
}
