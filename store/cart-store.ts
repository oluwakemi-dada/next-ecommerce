import { create } from 'zustand';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Cart } from '@/types';

type CartState = {
  cart: Cart | undefined;
  cartLoading: boolean;
  setCart: (cart: Cart) => void;
  fetchCart: () => Promise<void>;
  updateCartOptimistically: (updater: (cart: Cart) => Cart) => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: undefined,
  cartLoading: true,

  setCart: (cart) => {
    set({ cart });
  },

  fetchCart: async () => {
    set({ cartLoading: true });

    try {
      const fetchedCart = await getMyCart();
      set({ cart: fetchedCart, cartLoading: false });
    } catch (error) {
      console.error('Error loading cart:', error);

      // fallback to empty cart if error occurs
      set({
        cart: {
          items: [],
          itemsPrice: '0',
          totalPrice: '0',
          shippingPrice: '0',
          taxPrice: '0',
          sessionCartId: crypto.randomUUID(),
          userId: undefined,
        },
        cartLoading: false,
      });
    }
  },

  updateCartOptimistically: (updater) => {
    const currentCart = get().cart;

    if (currentCart) {
      set({ cart: updater(currentCart) });
    }
  },
}));
