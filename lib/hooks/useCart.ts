"use client";
import { useState, useEffect, useCallback } from "react";

const CART_KEY = "styleflow_cart";

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on client
  useEffect(() => {
    setItems(readFromStorage());
    setHydrated(true);
  }, []);

  const addItem = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeToStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    writeToStorage([]);
  }, []);

  const isInCart = useCallback(
    (id: string) => items.includes(id),
    [items]
  );

  const toggleItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      writeToStorage(next);
      return next;
    });
  }, []);

  return { items, hydrated, addItem, removeItem, clearCart, isInCart, toggleItem };
}
