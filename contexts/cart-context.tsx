'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '@/types';
import { getMyCart } from '@/lib/actions/cart.actions';

type CartContextType = {
  cart: Cart | undefined;
  setCart: (cart: Cart) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | undefined>(undefined);

  useEffect(() => {
    let ignore = false;

    const fetchCart = async () => {
      try {
        const fetchedCart = await getMyCart();
        if (!ignore) setCart(fetchedCart);
      } catch (err) {
        if (!ignore) console.error(err);
      }
    };

    fetchCart();
    return () => {
      ignore = true;
    };
  }, []);

  return <CartContext value={{ cart, setCart }}>{children}</CartContext>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
