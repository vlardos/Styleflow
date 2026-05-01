"use client";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";

type WeatherInfo = {
  city: string;
  temp: number;
  condition: string;
  category: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
};

type WeatherFitResponse = {
  weather: WeatherInfo;
  products: Product[];
  message: string;
};

const categoryMeta: Record<string, { label: string; icon: string }> = {
  warm: { label: "Warm", icon: "○" },
  cold: { label: "Cold", icon: "◇" },
  rainy: { label: "Rainy", icon: "⌇" },
  any:  { label: "All Weather", icon: "◎" },
};

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WeatherFitResponse | null>(null);
  const { isInCart, toggleItem } = useCart();

  async function handleSearch() {
    const trimmed = city.trim();
    if (!trimmed || loading) return;
    if (trimmed.length > 100) { setError("City name is too long"); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/weather-fit?city=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error ?? "Could not fetch weather data"); return; }
      setResult(data);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const meta = result ? (categoryMeta[result.weather.category] ?? { label: result.weather.category, icon: "◎" }) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-16">

        {/* Page header */}
        <div className="mb-16">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-4">StyleFlow</p>
          <h1 className="font-serif font-light text-5xl lg:text-6xl text-white/90 leading-none">
            Dress for<br />the weather.
          </h1>
          <div className="mt-8 h-px bg-white/8" />
        </div>

        {/* Search */}
        <div className="flex items-end gap-4 mb-16">
          <div className="flex-1 relative">
            <input
              className="w-full border-b border-white/10 bg-transparent text-sm py-3 outline-none placeholder:text-white/20 text-white/70 focus:border-white/30 transition-colors pr-4"
              maxLength={100}
              placeholder="Warsaw, Tokyo, New York..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white/80 transition-colors disabled:opacity-20 pb-3 shrink-0"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-[11px] text-red-400/70 uppercase tracking-[0.2em] mb-10">{error}</p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-10 animate-pulse">
            <div>
              <div className="h-20 w-32 bg-white/5 mb-4" />
              <div className="h-2 w-24 bg-white/5 mb-2" />
              <div className="h-2 w-16 bg-white/5" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-2 bg-white/5 w-full" />
              <div className="h-2 bg-white/5 w-4/5" />
              <div className="h-2 bg-white/5 w-3/5" />
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-b border-white/6 pb-5 flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-2 bg-white/5 w-36" />
                  <div className="h-2 bg-white/5 w-16" />
                </div>
                <div className="h-2 bg-white/5 w-10" />
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="flex flex-col gap-14 animate-fade-in">

            {/* Weather card */}
            <div className="border border-white/6 p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-3">
                    {result.weather.city}
                  </p>
                  <p
                    className="font-serif font-light text-white/90 leading-none"
                    style={{ fontSize: "clamp(4rem, 14vw, 6rem)" }}
                  >
                    {result.weather.temp}°
                  </p>
                </div>
                {meta && (
                  <div className="text-right">
                    <span className="text-3xl text-white/20">{meta.icon}</span>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mt-2">{meta.label}</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/35 font-light">{result.weather.condition}</p>
            </div>

            {/* AI message */}
            <div className="border-l border-white/10 pl-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3">Stylist note</p>
              <p className="text-sm text-white/45 font-light leading-loose italic">
                {result.message}
              </p>
            </div>

            {/* Products */}
            {result.products.length > 0 ? (
              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-6">
                  Recommended for today
                </p>
                <div className="border-t border-white/6">
                  {result.products.map((p) => {
                    const inCart = isInCart(p.id);
                    return (
                      <div
                        key={p.id}
                        className="border-b border-white/6 py-5 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm text-white/70 font-light">{p.name}</p>
                          <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 mt-1">{p.category}</p>
                        </div>
                        <div className="flex items-center gap-5 shrink-0">
                          <span className="text-sm text-white/35 tabular-nums">${p.price}</span>
                          <button
                            onClick={() => toggleItem(p.id)}
                            className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                              inCart
                                ? "text-white/25 hover:text-white/60"
                                : "text-white/60 hover:text-white"
                            }`}
                          >
                            {inCart ? "Remove" : "Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/20">
                No items found for this weather.
              </p>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
