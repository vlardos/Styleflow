"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";

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
        setProducts(all.filter((p) => cartItems.includes(p.id)));
      });
  }, [hydrated, cartItems]);

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

  // Wait for hydration before deciding cart is empty
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-px bg-zinc-200 animate-pulse" />
      </div>
    );
  }

  // Empty cart
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Your bag is empty
        </p>
        <button
          onClick={() => router.push("/catalog")}
          className="text-xs uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  // Order confirmed
  if (order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-6 py-20">
          <div className="w-full h-px bg-zinc-900 mb-16" />

          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
            Order Confirmed
          </p>
          <h2 className="font-serif text-4xl font-light text-zinc-900 leading-tight">
            Thank you,<br />{order.customerName}.
          </h2>
          <p className="text-sm text-zinc-400 mt-4 mb-12 leading-relaxed">
            Your order has been placed. You'll receive a confirmation shortly.
          </p>

          <div className="border-t border-zinc-100">
            <div className="flex justify-between py-4 border-b border-zinc-100">
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Order ID</span>
              <span className="font-mono text-xs text-zinc-600">{order.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-zinc-100">
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Items</span>
              <span className="text-sm text-zinc-700">{order.items.length} {order.items.length === 1 ? "piece" : "pieces"}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Total</span>
              <span className="text-sm text-zinc-900">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <button
              onClick={() => router.push("/catalog")}
              className="flex-1 bg-zinc-900 text-white text-xs uppercase tracking-widest py-4 hover:bg-zinc-700 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-zinc-200 text-zinc-900 text-xs uppercase tracking-widest py-4 hover:border-zinc-900 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order form
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-md mx-auto px-6 lg:px-12 py-12">

        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Checkout</p>
        <h1 className="font-serif text-3xl font-light text-zinc-900 mb-10">Your Bag</h1>

        {/* Items list */}
        <div className="border-t border-zinc-100">
          {products.map((p) => (
            <div key={p.id} className="flex items-baseline justify-between py-5 border-b border-zinc-100">
              <div>
                <p className="text-sm text-zinc-900">{p.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 mt-1">{p.category}</p>
              </div>
              <p className="text-sm text-zinc-500">${p.price.toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between py-5">
            <span className="text-xs uppercase tracking-widest text-zinc-400">Total</span>
            <span className="text-sm text-zinc-900">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Name input */}
        <div className="mt-10 max-w-sm">
          <label className="text-[11px] uppercase tracking-widest text-zinc-400 block mb-3">
            Your Name
          </label>
          <input
            className="w-full border-b border-zinc-200 bg-transparent text-sm py-2 outline-none placeholder:text-zinc-300 focus:border-zinc-900 transition-colors"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 max-w-sm">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-zinc-900 text-white text-xs uppercase tracking-widest py-4 hover:bg-zinc-700 transition-colors disabled:opacity-40"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
          <button
            onClick={() => router.push("/catalog")}
            className="flex-1 border border-zinc-200 text-zinc-900 text-xs uppercase tracking-widest py-4 hover:border-zinc-900 transition-colors"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}
