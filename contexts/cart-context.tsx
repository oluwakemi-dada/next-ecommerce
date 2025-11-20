'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '@/types';
import { getMyCart } from '@/lib/actions/cart.actions';

type CartContextType = {
  cart: Cart | undefined;
  setCart: (cart: Cart) => void;
  cartLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState<Cart | undefined>(undefined);

  useEffect(() => {
    let ignore = false;

    const fetchCart = async () => {
      try {
        const fetchedCart = await getMyCart();
        if (!ignore) setCart(fetchedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        if (!ignore) {
          // fallback to empty cart if error occurs
          setCart({
            items: [],
            itemsPrice: '0',
            totalPrice: '0',
            shippingPrice: '0',
            taxPrice: '0',
            sessionCartId: crypto.randomUUID(),
            userId: undefined,
          });
        }
      } finally {
        if (!ignore) setCartLoading(false);
      }
    };

    fetchCart();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <CartContext value={{ cart, setCart, cartLoading }}>{children}</CartContext>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
