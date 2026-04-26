"use client";

import Image from "next/image";
import TransitionLink from "@/components/ui/TransitionLink";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: text */}
      <div className="flex-1 flex items-center px-12 py-20 bg-white">
        <div className="max-w-lg">
          <h1 className="font-serif font-light tracking-tight text-zinc-900 mb-8 animate-fade-in-up">
            <span className="block text-5xl md:text-7xl">Curated style,</span>
            <span className="block text-4xl md:text-6xl text-zinc-400 mt-2">
              powered by intelligence.
            </span>
          </h1>
          <p className="text-zinc-500 text-base font-light max-w-sm mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
            Discover your personal style with AI-powered recommendations
            tailored to your taste, weather, and lifestyle.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
            <TransitionLink
              href="/catalog"
              className="bg-zinc-900 text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-zinc-700 transition-colors"
            >
              Explore Collection
            </TransitionLink>
            <TransitionLink
              href="/chat"
              className="border border-zinc-300 text-zinc-900 px-8 py-4 text-xs uppercase tracking-widest hover:border-zinc-900 transition-colors"
            >
              Ask AI Stylist
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Right: editorial image */}
      <div className="relative lg:w-1/2 h-[55vh] lg:h-auto overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop"
          alt="StyleFlow editorial"
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </section>
  );
}
