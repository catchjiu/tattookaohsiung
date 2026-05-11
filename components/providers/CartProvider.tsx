"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY, type CartLine, parseCartJson } from "@/lib/cart-storage";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  ready: boolean;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    return parseCartJson(raw);
  } catch {
    return [];
  }
}

function writeStorage(lines: CartLine[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readStorage());
    setReady(true);
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    writeStorage(next);
  }, []);

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const q = Math.max(1, Math.min(99, quantity));
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.productId === productId);
        let next: CartLine[];
        if (idx === -1) {
          next = [...prev, { productId, quantity: q }];
        } else {
          const merged = [...prev];
          merged[idx] = {
            ...merged[idx],
            quantity: Math.min(99, merged[idx].quantity + q),
          };
          next = merged;
        }
        writeStorage(next);
        return next;
      });
    },
    []
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const q = Math.floor(Math.max(0, Math.min(99, quantity)));
    setLines((prev) => {
      let next: CartLine[];
      if (q <= 0) {
        next = prev.filter((l) => l.productId !== productId);
      } else {
        const idx = prev.findIndex((l) => l.productId === productId);
        if (idx === -1) {
          next = [...prev, { productId, quantity: q }];
        } else {
          next = [...prev];
          next[idx] = { ...next[idx], quantity: q };
        }
      }
      writeStorage(next);
      return next;
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.productId !== productId);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    writeStorage([]);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      ready,
      addItem,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [lines, itemCount, ready, addItem, setQuantity, removeLine, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
