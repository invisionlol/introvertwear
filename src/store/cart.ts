import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  title: string;
  price: number; // already discounted price
  image: string | null;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;

  // Drawer controls
  openCart: () => void;
  closeCart: () => void;

  // Cart actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  // Derived (called as functions to stay reactive)
  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (newItem) => {
        const existing = get().items.find((i) => i.id === newItem.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...newItem, quantity: 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [], isOpen: false }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "introvertwear-cart",
      // Only persist items, not the drawer open state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
