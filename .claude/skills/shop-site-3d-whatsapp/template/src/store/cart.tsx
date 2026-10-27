import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TOPPINGS, type Drink } from '../data/menu';
import { SHOP } from '../data/config';

export type Size = 'M' | 'L' | 'One size';

export interface CartLine {
  key: string;
  code: string;
  name: string;
  img: string;
  size: Size;
  ice?: string;
  sugar?: string;
  extras: string[];
  unit: number;
  qty: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  picking: Drink | null;
  pick: (d: Drink | null) => void;
  add: (l: Omit<CartLine, 'key' | 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = SHOP.storageKey;

export const priceFor = (d: Drink, size: Size) => (size === 'M' ? d.m! : size === 'L' ? d.l ?? d.price! : d.price ?? d.l!);
export const extrasTotal = (ids: string[]) => ids.reduce((s, id) => s + (TOPPINGS.find((t) => t.id === id)?.price ?? 0), 0);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [open, setOpen] = useState(false);
  const [picking, pick] = useState<Drink | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {
      /* storage unavailable: cart just won't persist */
    }
  }, [lines]);

  const add = useCallback((l: Omit<CartLine, 'key' | 'qty'>, qty = 1) => {
    const key = [l.code, l.size, l.ice, l.sugar, [...l.extras].sort().join('+')].join('|');
    setLines((prev) => {
      const found = prev.find((p) => p.key === key);
      if (found) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...l, key, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((p) => p.key !== key) : prev.map((p) => (p.key === key ? { ...p, qty } : p))));
  }, []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.qty * l.unit, 0);
    return { lines, count, subtotal, open, setOpen, picking, pick, add, setQty, clear: () => setLines([]) };
  }, [lines, open, picking, add, setQty]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
