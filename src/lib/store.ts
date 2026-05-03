import { create } from "zustand";

export interface CartItem {
  key: string;
  quantity: number;
  total: string;
  product: {
    node: {
      id: string;
      name: string;
      image?: { sourceUrl: string };
    };
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: string;
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCart: (items: CartItem[], subtotal: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  totalItems: 0,
  subtotal: "$0.00",

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set({ isOpen: !get().isOpen }),

  setCart: (items, subtotal) =>
    set({
      items,
      subtotal,
      totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
    }),

  clearCart: () => set({ items: [], totalItems: 0, subtotal: "$0.00" }),
}));
