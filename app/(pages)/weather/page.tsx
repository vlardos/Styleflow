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

const categoryLabel: Record<string, string> = {
  warm: "Warm",
  cold: "Cold",
  rainy: "Rainy",
  any: "All Weather",
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
    if (trimmed.length > 100) {
      setError("City name is too long");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/weather-fit?city=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Could not fetch weather data");
        return;
      }

      setResult(data);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 bg-white">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Dress for the Weather</p>
        <h1 className="font-serif text-2xl text-zinc-900">Enter your city to get styled.</h1>
      </div>

      {/* Search */}
      <div className="flex items-end gap-4 border-b border-zinc-200 pb-4 mb-10">
        <input
          className="flex-1 border-b border-zinc-300 bg-transparent text-sm py-3 outline-none placeholder:text-zinc-400 text-zinc-900"
          maxLength={100}
          placeholder="Warsaw, Tokyo, New York..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="text-xs uppercase tracking-widest text-zinc-900 hover:text-zinc-500 transition-colors disabled:opacity-30 pb-3"
        >
          Find
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-6">{error}</p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-6">
          <div className="animate-pulse">
            <div className="h-16 bg-zinc-100 rounded w-1/4 mb-2" />
            <div className="h-3 bg-zinc-100 rounded w-1/3" />
          </div>
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-3 bg-zinc-100 rounded w-full" />
            <div className="h-3 bg-zinc-100 rounded w-4/5" />
            <div className="h-3 bg-zinc-100 rounded w-3/5" />
          </div>
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-b border-zinc-100 pb-4">
                <div className="h-3 bg-zinc-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-zinc-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="flex flex-col gap-10">

          {/* Weather block */}
          <div>
            <p className="font-serif text-6xl font-light text-zinc-900 mb-2">
              {result.weather.temp}°
            </p>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
              {result.weather.city}
            </p>
            <p className="text-sm text-zinc-500 mb-3">{result.weather.condition}</p>
            <span className="text-xs uppercase tracking-widest border border-zinc-200 px-3 py-1 inline-block text-zinc-600">
              {categoryLabel[result.weather.category] ?? result.weather.category}
            </span>
          </div>

          {/* AI message */}
          <p className="italic text-zinc-600 border-l-2 border-zinc-200 pl-4 text-sm leading-relaxed">
            {result.message}
          </p>

          {/* Products */}
          <div>
            {result.products.length > 0 ? (
              <div className="flex flex-col">
                {result.products.map((p) => {
                  const inCart = isInCart(p.id);
                  return (
                    <div
                      key={p.id}
                      className="border-b border-zinc-100 py-3 flex items-center justify-between gap-4 last:border-b-0"
                    >
                      <div>
                        <div className="text-sm text-zinc-900">{p.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{p.category}</div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-sm text-zinc-700">${p.price}</span>
                        <button
                          onClick={() => toggleItem(p.id)}
                          className={`text-xs uppercase tracking-widest transition-colors ${
                            inCart
                              ? "text-zinc-400 hover:text-zinc-900"
                              : "text-zinc-900 hover:text-zinc-400"
                          }`}
                        >
                          {inCart ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No items found for this weather.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
