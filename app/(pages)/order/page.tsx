"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import TransitionLink from "@/components/ui/TransitionLink";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type Order = {
  orderId: string;
  items: string[];
  customerName: string;
  total: number;
  createdAt: string;
};

export default function OrderPage() {
  const router = useRouter();
  const { items: cartItems, hydrated, clearCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || !cartItems.length) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const all: Product[] = data.products ?? [];
        // cartItems намеренно не в deps — замыкание захватывает актуальное значение,
        // но эффект должен срабатывать только один раз после hydration
        setProducts(all.filter((p) => cartItems.includes(p.id)));
      })
      .catch(() => setError("Could not load product details."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const total = products.reduce((sum, p) => sum + p.price, 0);

  async function submit() {
    if (!customerName.trim()) { setError("Please enter your name"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, customerName: customerName.trim() }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error ?? "Something went wrong"); return; }
      setOrder(data.order);
      clearCart();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-px bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/20">Your bag is empty</p>
        <TransitionLink
          href="/catalog"
          className="text-[10px] uppercase tracking-[0.25em] text-white/40 border-b border-white/15 pb-0.5 hover:text-white/80 hover:border-white/40 transition-colors"
        >
          Explore Collection
        </TransitionLink>
      </div>
    );
  }

  if (order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-lg mx-auto px-6 py-20">

          <div className="w-full h-px bg-white/8 mb-16" />

          <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-5">
            Order Confirmed
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-white/90 leading-tight">
            Thank you,<br />{order.customerName}.
          </h2>
          <p className="text-sm text-white/30 mt-5 mb-14 leading-relaxed font-light">
            Your order has been placed. You'll receive a confirmation shortly.
          </p>

          <div className="border-t border-white/6">
            <div className="flex justify-between py-5 border-b border-white/6">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Order ID</span>
              <span className="font-mono text-[11px] text-white/40">{order.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between py-5 border-b border-white/6">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Items</span>
              <span className="text-sm text-white/50 font-light">{order.items.length} {order.items.length === 1 ? "piece" : "pieces"}</span>
            </div>
            <div className="flex justify-between py-5">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Total</span>
              <span className="text-sm text-white/70 font-light">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-14">
            <button
              onClick={() => router.push("/catalog")}
              className="flex-1 bg-white text-zinc-900 text-[10px] uppercase tracking-[0.25em] py-4 hover:bg-white/90 transition-colors font-medium"
            >
              Continue Shopping
            </button>
            <TransitionLink
              href="/"
              className="flex-1 border border-white/15 text-white/50 text-[10px] uppercase tracking-[0.25em] py-4 hover:border-white/40 hover:text-white/80 transition-colors text-center"
            >
              Home
            </TransitionLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-screen-md mx-auto px-6 lg:px-12 py-16">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-4">Checkout</p>
          <h1 className="font-serif font-light text-5xl lg:text-6xl text-white/90 leading-none">Your Bag</h1>
          <div className="mt-8 h-px bg-white/8" />
        </div>

        {/* Items */}
        <div className="border-t border-white/6 mb-14">
          {products.map((p) => (
            <div key={p.id} className="flex items-baseline justify-between py-6 border-b border-white/6">
              <div>
                <p className="text-sm text-white/70 font-light">{p.name}</p>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 mt-1">{p.category}</p>
              </div>
              <p className="text-sm text-white/40 font-light tabular-nums">${p.price.toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between py-6">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Total</span>
            <span className="text-sm text-white/70 font-light tabular-nums">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Name input */}
        <div className="max-w-sm mb-10">
          <label className="text-[9px] uppercase tracking-[0.35em] text-white/25 block mb-4">
            Your Name
          </label>
          <input
            className="w-full border-b border-white/10 bg-transparent text-sm py-3 outline-none placeholder:text-white/20 text-white/70 focus:border-white/30 transition-colors"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && <p className="text-[11px] text-red-400/70 uppercase tracking-[0.15em] mt-3">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-white text-zinc-900 text-[10px] uppercase tracking-[0.25em] py-4 hover:bg-white/90 transition-colors disabled:opacity-40 font-medium"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
          <button
            onClick={() => router.push("/catalog")}
            className="flex-1 border border-white/15 text-white/40 text-[10px] uppercase tracking-[0.25em] py-4 hover:border-white/35 hover:text-white/70 transition-colors"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}
