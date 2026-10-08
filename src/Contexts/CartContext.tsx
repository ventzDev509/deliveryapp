import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CartItem = { id: string; restaurantId: string; restaurantName: string; name: string; price: number; image?: string | null; quantity: number };
type CartContextValue = { items: CartItem[]; total: number; addItem: (item: Omit<CartItem, 'quantity'>) => boolean; setQuantity: (id: string, quantity: number) => void; removeItem: (id: string) => void; clearCart: () => void };

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = 'delivery_cart_v1';

function readCart(): CartItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]') as CartItem[];
    return Array.isArray(value) ? value.filter((item) => item && typeof item.id === 'string' && Number(item.quantity) > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);
  useEffect(() => { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }, [items]);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const addItem: CartContextValue['addItem'] = (item) => {
    if (items.length && items.some((existing) => existing.restaurantId !== item.restaurantId)) return false;
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      return existing
        ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...current, { ...item, quantity: 1 }];
    });
    return true;
  };

  const setQuantity = (id: string, quantity: number) => setItems((current) => quantity <= 0
    ? current.filter((item) => item.id !== id)
    : current.map((item) => item.id === id ? { ...item, quantity: Math.floor(quantity) } : item));
  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);

  return <CartContext.Provider value={{ items, total, addItem, setQuantity, removeItem, clearCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart dwe itilize anndan yon CartProvider');
  return context;
}
