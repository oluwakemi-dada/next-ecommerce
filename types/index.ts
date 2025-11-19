import { z } from 'zod';
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  variantSchema,
} from '@/lib/validators';

export type VariantInput = z.infer<typeof variantSchema>;
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
