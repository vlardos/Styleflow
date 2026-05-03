import {
  getProductByIdFromDb,
  getRelatedProductsFromDb,
} from "@/lib/services/product.service";
import TransitionLink from "@/components/ui/TransitionLink";
import ProductImage from "@/components/ui/ProductImage";
import AddToCartButton from "@/components/ui/AddToCartButton";
import MobileCartCTA from "@/components/ui/MobileCartCTA";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const [product, related] = await Promise.all([
    getProductByIdFromDb(id),
    getRelatedProductsFromDb(id),
  ]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/25">
          Product not found
        </p>
        <TransitionLink
          href="/catalog"
          className="text-[10px] uppercase tracking-[0.25em] text-white/50 border-b border-white/20 pb-0.5 hover:text-white hover:border-white/60 transition-colors"
        >
          Back to Collection
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/25 mb-12">
          <TransitionLink href="/catalog" className="hover:text-white/60 transition-colors">
            Collection
          </TransitionLink>
          <span>/</span>
          <TransitionLink
            href={`/catalog?category=${product.category}`}
            className="hover:text-white/60 transition-colors capitalize"
          >
            {product.category}
          </TransitionLink>
          <span>/</span>
          <span className="text-white/40 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Left — image */}
          <div className="relative aspect-[3/4] w-full bg-zinc-900 overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              imageQuery={product.imageQuery}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Right — info */}
          <div className="flex flex-col lg:py-6">

            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-4">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl lg:text-6xl font-light leading-[1.05] text-white/90">
              {product.name}
            </h1>

            <p className="text-2xl text-white/35 mt-6 font-light">
              ${product.price.toFixed(2)}
            </p>

            <div className="w-10 h-px bg-white/10 my-10" />

            {product.description && (
              <p className="text-sm text-white/40 leading-loose max-w-sm font-light">
                {product.description}
              </p>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-[0.25em] px-3 py-1.5 border border-white/10 text-white/25"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-white/6 my-10" />

            {/* CTA — desktop */}
            <div className="hidden lg:block">
              <AddToCartButton productId={product.id} />
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-white/20 mt-8">
              Style: {product.style}
              {product.season.length > 0 && (
                <> &middot; Season: {product.season.join(", ")}</>
              )}
            </p>
          </div>
        </div>

        {/* Complete the Look */}
        {related.length > 0 && (
          <section className="mt-28 lg:mt-36">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/20">Also consider</p>
            </div>
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="font-serif text-3xl font-light text-white/80">Complete the Look</h2>
              <TransitionLink
                href="/catalog"
                className="text-[10px] uppercase tracking-[0.25em] text-white/25 hover:text-white/60 transition-colors border-b border-white/10 hover:border-white/30 pb-0.5"
              >
                View All
              </TransitionLink>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-12">
              {related.map((item) => (
                <TransitionLink
                  key={item.id}
                  href={`/catalog/${item.id}`}
                  className="block group"
                >
                  <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      imageQuery={item.imageQuery}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                    />
                  </div>
                  <div className="mt-4 px-0.5">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-1">
                      {item.category}
                    </p>
                    <p className="text-sm text-white/70 font-light group-hover:text-white transition-colors duration-300">
                      {item.name}
                    </p>
                    <p className="text-sm text-white/30 mt-1 font-light">
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
