'use server';
import { CartItem } from '@/types';

export const addItemToCart = async (data: CartItem) => {
  return {
    success: true,
    message: 'Item added to cart'
  };
};
