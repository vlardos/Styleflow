"use client";

import TransitionLink from "@/components/ui/TransitionLink";

export default function Home() {
  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center -mt-[72px]" style={{ minHeight: "100dvh" }}>

      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ filter: "brightness(0.75) contrast(1.1) saturate(1.2)" }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Depth layers — объёмный эффект */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">

        {/* Eyebrow tag */}
        <span className="inline-block mb-6 text-[10px] uppercase tracking-[0.35em] text-white/50 border border-white/20 px-4 py-1.5 backdrop-blur-sm">
          AI-Powered Fashion
        </span>

        {/* Headline */}
        <h1 className="font-serif font-light text-white leading-[1.05] mb-6">
          <span
            className="block"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            Curated style,
          </span>
          <span
            className="block text-white/50 mt-1"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            powered by intelligence.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/40 font-light max-w-md mb-12 leading-relaxed"
          style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
        >
          Discover your personal style with AI-powered recommendations
          tailored to your taste, weather, and lifestyle.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <TransitionLink
            href="/catalog"
            className="group relative overflow-hidden bg-white text-zinc-900 px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] text-center"
          >
            <span className="relative z-10">Explore Collection</span>
          </TransitionLink>

          <TransitionLink
            href="/chat"
            className="group border border-white/30 text-white px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-light transition-all duration-300 backdrop-blur-sm hover:bg-white/10 hover:border-white/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] text-center"
          >
            Ask AI Stylist
          </TransitionLink>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-white text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-10 bg-white/60 animate-pulse" />
        </div>
      </div>

    </section>
  );
}
