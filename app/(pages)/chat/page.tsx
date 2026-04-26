"use client";
import { useState, useRef, useEffect } from "react";
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

function getGeolocation(): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isInCart, toggleItem } = useCart();

  // Загружаем историю из localStorage при mount
  useEffect(() => {
    const saved = localStorage.getItem("styleflow_chat");
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Сохраняем историю в localStorage при каждом изменении
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("styleflow_chat", JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  useEffect(() => {
    getGeolocation().then(setCoords);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    // Добавляем user сообщение и сохраняем для передачи в историю
    const newMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Добавляем пустое assistant сообщение — будем заполнять по мере стриминга
    setMessages(prev => [...prev, { role: "assistant" as const, content: "", products: undefined, toolCalls: undefined }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          coords: coords ?? undefined,
          history: newMessages.slice(-8).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
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
              // Записываем tool calls и продукты, снимаем loading (tool phase done)
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
              setLoading(false);
            } else if (event.type === "text") {
              // Дописываем текст по delta
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
                  updated[updated.length - 1] = { ...last, content: event.message ?? "Ошибка ответа." };
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          updated[updated.length - 1] = { ...last, content: "Connection error." };
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleChip(chip: string) {
    setInput(chip);
    send(chip);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col h-[85vh] bg-white">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Your AI Stylist</p>
          <h1 className="font-serif text-2xl text-zinc-900">Style, curated for you.</h1>
        </div>
        <button
          onClick={() => { setMessages([]); localStorage.removeItem("styleflow_chat"); }}
          className="text-xs uppercase tracking-widest text-zinc-300 hover:text-zinc-900 transition-colors pb-1"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-6">

        {/* Empty state: chips */}
        {messages.length === 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                className="border border-zinc-200 text-xs px-4 py-2 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col gap-2 max-w-[85%] ${
              m.role === "user" ? "self-end items-end" : "self-start items-start"
            }`}
          >
            {/* Tool calls trace */}
            {m.toolCalls && m.toolCalls.length > 0 && (
              <div className="flex flex-col gap-0.5">
                {m.toolCalls.map((tc, j) => (
                  <span key={j} className="text-xs text-zinc-400 font-mono">
                    {toolLabels[tc.tool] ?? tc.tool}
                    {tc.args && Object.keys(tc.args).length > 0 && (
                      <span className="text-zinc-300 ml-1">
                        ({Object.entries(tc.args).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`px-4 py-3 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-zinc-900 text-white rounded-2xl rounded-br-sm"
                  : "bg-zinc-50 border border-zinc-100 rounded-2xl rounded-bl-sm text-zinc-800"
              }`}
            >
              {m.content || (m.role === "assistant" && !loading ? "..." : m.content)}
            </div>

            {/* Products */}
            {m.products && m.products.length > 0 && (
              <div className="flex flex-col w-full">
                {m.products.map((p) => {
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
            )}
          </div>
        ))}

        {/* Loading indicator — показываем только пока нет assistant bubble */}
        {loading && (
          <div className="self-start flex flex-col gap-1">
            <span className="text-xs text-zinc-400 font-mono">thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 pt-4 flex items-end gap-4">
        <input
          className="flex-1 border-b border-zinc-300 bg-transparent text-sm py-3 outline-none placeholder:text-zinc-400 text-zinc-900"
          placeholder="Ask your stylist..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="text-xs uppercase tracking-widest text-zinc-900 hover:text-zinc-500 transition-colors disabled:opacity-30 pb-3"
        >
          Send
        </button>
      </div>
    </div>
  );
}
