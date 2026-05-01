"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useCart } from "@/lib/hooks/useCart";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
};

type ToolCall = {
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  toolCalls?: ToolCall[];
};

type Coords = { lat: number; lon: number };
type GeoStatus = "idle" | "requesting" | "active" | "denied" | "unavailable";

function requestGeolocation(): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

const toolLabels: Record<string, string> = {
  get_products: "loading catalog",
  search_products: "searching products",
  get_product_by_id: "fetching item",
  get_weather: "checking weather",
  get_weather_by_coords: "locating weather",
  create_order: "placing order",
};

const CHIPS = [
  "What should I wear today?",
  "Create a minimalist outfit",
  "Suggest a rainy day look",
  "Style me for a business meeting",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [manualCity, setManualCity] = useState("");
  const [showCityInput, setShowCityInput] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { isInCart, toggleItem } = useCart();

  // Отменяем активный запрос при размонтировании компонента
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("styleflow_chat");
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("styleflow_chat", JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  const tryGeolocation = useCallback(async () => {
    // Геолокация требует HTTPS на мобильных (кроме localhost)
    const isSecure = location.protocol === "https:" || location.hostname === "localhost";
    if (!isSecure || !navigator.geolocation) {
      setGeoStatus("unavailable");
      setShowCityInput(true);
      return;
    }
    setGeoStatus("requesting");
    const result = await requestGeolocation();
    if (result) {
      setCoords(result);
      setGeoStatus("active");
      setShowCityInput(false);
    } else {
      setGeoStatus("denied");
      setShowCityInput(true);
    }
  }, []);

  useEffect(() => {
    tryGeolocation();
  }, [tryGeolocation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    // Отменяем предыдущий запрос если есть
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const newMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "assistant" as const, content: "", products: undefined, toolCalls: undefined }]);

    try {
      const body: Record<string, unknown> = {
        message,
        history: newMessages.slice(-8).map(m => ({ role: m.role, content: m.content })),
      };
      if (coords) body.coords = coords;
      else if (manualCity.trim()) body.city = manualCity.trim();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (controller.signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const event = JSON.parse(data);
            if (event.type === "meta") {
              // Только сохраняем tool calls и продукты — loading НЕ снимаем,
              // стриминг текста ещё не начался
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    toolCalls: event.toolCalls?.length > 0 ? event.toolCalls : undefined,
                    products: event.products?.length > 0 ? event.products : undefined,
                  };
                }
                return updated;
              });
            } else if (event.type === "text") {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, content: last.content + event.delta };
                }
                return updated;
              });
            } else if (event.type === "error") {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, content: event.message ?? "Error." };
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      // Игнорируем ошибку если запрос был отменён (navigate away)
      if (controller.signal.aborted) return;
      if (process.env.NODE_ENV === "development") console.error("[chat stream]", e);
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          updated[updated.length - 1] = { ...last, content: "Connection error." };
        }
        return updated;
      });
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  function handleChip(chip: string) {
    send(chip);
  }

  // Geo status indicator config
  const geoIndicator = {
    active:      { dot: "bg-white/60",  text: "Location active",     action: null },
    requesting:  { dot: "bg-white/30 animate-pulse", text: "Locating...", action: null },
    denied:      { dot: "bg-red-400/40", text: "Location denied",    action: "retry" },
    unavailable: { dot: "bg-white/20",  text: "Location unavailable", action: "city" },
    idle:        { dot: "bg-white/20",  text: "Location off",        action: "retry" },
  }[geoStatus];

  return (
    <div className="bg-[#0a0a0a] chat-height flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-6 flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="py-6 border-b border-white/6 flex items-end justify-between shrink-0">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-3">AI Stylist</p>
            <h1 className="font-serif text-3xl font-light text-white/85">Style, curated for you.</h1>
          </div>
          <button
            onClick={() => { setMessages([]); localStorage.removeItem("styleflow_chat"); }}
            className="text-[10px] uppercase tracking-[0.25em] text-white/20 hover:text-white/60 transition-colors mb-1"
          >
            Clear
          </button>
        </div>

        {/* Location status bar */}
        <div className="flex items-center justify-between py-3 border-b border-white/4 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${geoIndicator.dot}`} />
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
              {geoIndicator.text}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {geoIndicator.action === "retry" && (
              <button
                onClick={tryGeolocation}
                className="text-[9px] uppercase tracking-[0.2em] text-white/25 hover:text-white/60 transition-colors border-b border-white/10 hover:border-white/30 pb-px"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => setShowCityInput((v) => !v)}
              className="text-[9px] uppercase tracking-[0.2em] text-white/25 hover:text-white/60 transition-colors border-b border-white/10 hover:border-white/30 pb-px"
            >
              {showCityInput ? "Hide" : "Enter city"}
            </button>
          </div>
        </div>

        {/* Manual city input */}
        {showCityInput && (
          <div className="flex items-end gap-3 py-3 border-b border-white/4 shrink-0">
            <input
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="Warsaw, Tokyo, London..."
              className="flex-1 bg-transparent border-b border-white/10 text-sm text-white/60 placeholder:text-white/15 outline-none py-1.5 focus:border-white/25 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && setShowCityInput(false)}
            />
            {manualCity && (
              <button
                onClick={() => setShowCityInput(false)}
                className="text-[9px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors pb-1.5 shrink-0"
              >
                Set
              </button>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 py-6 min-h-0">

          {messages.length === 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  className="border border-white/10 text-[11px] px-4 py-2.5 text-white/35 hover:border-white/30 hover:text-white/70 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 max-w-[88%] ${
                m.role === "user" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="flex flex-col gap-0.5 mb-1">
                  {m.toolCalls.map((tc, j) => (
                    <span key={j} className="text-[10px] text-white/20 font-mono tracking-wide">
                      ↳ {toolLabels[tc.tool] ?? tc.tool}
                    </span>
                  ))}
                </div>
              )}

              <div
                className={`px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-white text-zinc-900"
                    : "bg-white/5 border border-white/8 text-white/70"
                }`}
              >
                {m.content || (m.role === "assistant" && !loading ? "..." : m.content)}
              </div>

              {m.products && m.products.length > 0 && (
                <div className="w-full border border-white/6 mt-1">
                  {m.products.map((p) => {
                    const inCart = isInCart(p.id);
                    return (
                      <div
                        key={p.id}
                        className="border-b border-white/6 px-4 py-4 flex items-center justify-between gap-4 last:border-b-0"
                      >
                        <div>
                          <div className="text-sm text-white/70 font-light">{p.name}</div>
                          <div className="text-[9px] uppercase tracking-[0.25em] text-white/25 mt-0.5">{p.category}</div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-sm text-white/35 tabular-nums">${p.price}</span>
                          <button
                            onClick={() => toggleItem(p.id)}
                            className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                              inCart ? "text-white/25 hover:text-white/60" : "text-white/60 hover:text-white"
                            }`}
                          >
                            {inCart ? "Remove" : "Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start flex items-center gap-2">
              <span className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em]">thinking</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-1 rounded-full bg-white/20 animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/6 pt-5 pb-6 flex items-end gap-4 shrink-0">
          <input
            className="flex-1 border-b border-white/10 bg-transparent text-sm py-3 outline-none placeholder:text-white/20 text-white/70 focus:border-white/30 transition-colors"
            placeholder="Ask your stylist..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={() => send()}
            disabled={loading}
            className="text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white/80 transition-colors disabled:opacity-20 pb-3"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
