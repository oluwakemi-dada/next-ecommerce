'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';

const CartInitializer = () => {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  
  return null;
};

export default CartInitializer;
