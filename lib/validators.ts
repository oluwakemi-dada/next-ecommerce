import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places',
  );

// Variant schema
export const variantSchema = z.object({
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  stock: z.coerce
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock must be 0 or more'),
  price: currency.optional().nullable(),
  sku: z.string().min(1, 'SKU is required'),
  image: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  banner: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  price: currency,
  variants: z.array(variantSchema).optional().default([]),
});

// Schema for signing in users
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Schema for signing up a users
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().nullable().optional(),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
