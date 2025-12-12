import { z } from 'zod';
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  variantInputSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  paymentResultSchema,
  variantSchema,
} from '@/lib/validators';

export type VariantInput = z.infer<typeof variantInputSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Product = Omit<z.infer<typeof insertProductSchema>, 'variants'> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
  variants: Variant[];
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: {
    name: string;
    email: string;
  };
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type MonthlySale = {
  month: string;
  totalSales: number;
};

export type LatestSale = {
  id: string;
  createdAt: Date;
  totalPrice: number;
  user: {
    name: string;
  };
};

export type Summary = {
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  totalSales: number;
  latestSales: LatestSale[];
  salesData: MonthlySale[];
};
