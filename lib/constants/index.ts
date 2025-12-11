export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern ecommerce platform built with Next.js';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 6;

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD
  ? process.env.DEFAULT_PAYMENT_METHOD
  : 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
  variants: [],
};

export const variantDefaultValues = {
  color: null,
  size: null,
  stock: 0,
  price: null,
  image: null,
  isActive: true,
};

export const PRODUCT_CATEGORIES = {
  CLOTHING_MENS: {
    value: 'mens-clothing',
    label: "Men's Clothing",
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  },
  CLOTHING_WOMENS: {
    value: 'womens-clothing',
    label: "Women's Clothing",
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  },
  DRESSES: {
    value: 'dresses',
    label: 'Dresses',
    sizes: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
  },
  SHOES_MENS: {
    value: 'mens-shoes',
    label: "Men's Shoes",
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13', '14'],
  },
  SHOES_WOMENS: {
    value: 'womens-shoes',
    label: "Women's Shoes",
    sizes: [
      '5',
      '5.5',
      '6',
      '6.5',
      '7',
      '7.5',
      '8',
      '8.5',
      '9',
      '9.5',
      '10',
      '10.5',
      '11',
    ],
  },
  BRAS: {
    value: 'bras',
    label: 'Bras',
    sizes: [
      '30A',
      '30B',
      '30C',
      '30D',
      '32A',
      '32B',
      '32C',
      '32D',
      '34A',
      '34B',
      '34C',
      '34D',
      '36A',
      '36B',
      '36C',
      '36D',
      '38A',
      '38B',
      '38C',
      '38D',
    ],
  },
  ACCESSORIES: {
    value: 'accessories',
    label: 'Accessories',
    sizes: ['One Size'],
  },
  KIDS_CLOTHING: {
    value: 'kids-clothing',
    label: "Kids' Clothing",
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'],
  },
} as const;

export const CATEGORY_OPTIONS = Object.values(PRODUCT_CATEGORIES);
