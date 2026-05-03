"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useDbCart } from "@/lib/hooks/useDbCart";

type CartContextValue = ReturnType<typeof useDbCart>;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useDbCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
