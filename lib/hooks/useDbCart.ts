"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { CartData } from "@/lib/services/cart.service";

export type { CartData } from "@/lib/services/cart.service";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function calcTotals(items: CartData["items"]) {
  return {
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  };
}

export function useDbCart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const fetchId = useRef(0);

  const refresh = useCallback(async () => {
    const id = ++fetchId.current;
    try {
      const data = await apiFetch("/api/cart");
      if (fetchId.current === id) setCart(data.cart ?? null);
    } catch {
      // keep previous cart on transient network error
    } finally {
      if (fetchId.current === id) setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ─── Computed ────────────────────────────────────────────────────────────────

  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  const hydrated = !loading;

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  // ─── Mutations ───────────────────────────────────────────────────────────────

  // addItem: no optimistic (we don't have full product data client-side)
  const addItem = useCallback(async (productId: string, quantity = 1) => {
    setMutating(true);
    try {
      const data = await apiFetch("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      });
      setCart(data.cart ?? null);
    } catch (e) {
      throw e;
    } finally {
      setMutating(false);
    }
  }, []);

  // removeItem: optimistic — item disappears instantly, server confirms in bg
  const removeItem = useCallback(async (itemId: string) => {
    let snapshot: CartData | null = null;
    setCart((prev) => {
      snapshot = prev;
      if (!prev) return prev;
      const next = prev.items.filter((i) => i.id !== itemId);
      return { ...prev, items: next, ...calcTotals(next) };
    });

    try {
      await apiFetch("/api/cart/remove", {
        method: "DELETE",
        body: JSON.stringify({ itemId }),
      });
    } catch (e) {
      setCart(snapshot); // rollback on error
      throw e;
    }
  }, []);

  // updateQuantity: optimistic
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    let snapshot: CartData | null = null;
    setCart((prev) => {
      snapshot = prev;
      if (!prev) return prev;
      const next = quantity <= 0
        ? prev.items.filter((i) => i.id !== itemId)
        : prev.items.map((i) => i.id === itemId ? { ...i, quantity } : i);
      return { ...prev, items: next, ...calcTotals(next) };
    });

    try {
      await apiFetch("/api/cart/update", {
        method: "PATCH",
        body: JSON.stringify({ itemId, quantity }),
      });
    } catch (e) {
      setCart(snapshot);
      throw e;
    }
  }, []);

  const toggleItem = useCallback(
    async (productId: string) => {
      const existing = items.find((i) => i.productId === productId);
      if (existing) {
        await removeItem(existing.id);
      } else {
        await addItem(productId);
      }
    },
    [items, addItem, removeItem],
  );

  // clearCart: optimistic
  const clearCart = useCallback(async () => {
    let snapshot: CartData | null = null;
    setCart((prev) => {
      snapshot = prev;
      return prev ? { ...prev, items: [], itemCount: 0, subtotal: 0 } : null;
    });

    try {
      await apiFetch("/api/cart", { method: "DELETE" });
    } catch (e) {
      setCart(snapshot);
      throw e;
    }
  }, []);

  return {
    cart,
    items,
    itemCount,
    subtotal,
    loading,
    mutating,
    hydrated,
    isInCart,
    addItem,
    removeItem,
    updateQuantity,
    toggleItem,
    clearCart,
    refresh,
  };
}
