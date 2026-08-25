"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { variantBySku } from "./products";
import { useCatalogue } from "./catalog-context";

export type CartLine = {
  sku: string;
  qty: number;
};

type State = { lines: CartLine[] };

type Action =
  | { type: "add"; sku: string; qty?: number }
  | { type: "setQty"; sku: string; qty: number }
  | { type: "remove"; sku: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const STORAGE_KEY = "bioplus-cart-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.lines.find((l) => l.sku === action.sku);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.sku === action.sku ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { lines: [...state.lines, { sku: action.sku, qty }] };
    }
    case "setQty":
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.sku !== action.sku) };
      }
      return {
        lines: state.lines.map((l) =>
          l.sku === action.sku ? { ...l, qty: action.qty } : l,
        ),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.sku !== action.sku) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  detailedLines: {
    sku: string;
    qty: number;
    name: string;
    slug: string;
    label: string;
    price: number;
    lineTotal: number;
  }[];
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const catalogue = useCatalogue();
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines, hydrated]);

  const detailedLines = useMemo(() => {
    return state.lines
      .map((l) => {
        const found = variantBySku(catalogue, l.sku);
        if (!found) return null;
        const { product, variant } = found;
        return {
          sku: l.sku,
          qty: l.qty,
          name: product.name,
          slug: product.slug,
          label: variant.label,
          price: variant.price,
          lineTotal: variant.price * l.qty,
        };
      })
      .filter(Boolean) as CartContextValue["detailedLines"];
  }, [state.lines, catalogue]);

  const value: CartContextValue = useMemo(
    () => ({
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      subtotal: detailedLines.reduce((sum, l) => sum + l.lineTotal, 0),
      add: (sku, qty) => {
        dispatch({ type: "add", sku, qty });
        setDrawerOpen(true);
      },
      setQty: (sku, qty) => dispatch({ type: "setQty", sku, qty }),
      remove: (sku) => dispatch({ type: "remove", sku }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      setDrawerOpen,
      detailedLines,
    }),
    [state.lines, detailedLines, drawerOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
