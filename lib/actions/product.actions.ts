'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { serializeProduct } from '../utils';

// Get latests products
export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
  });

  return data.map(serializeProduct);
};

// Get single product by its slug
export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug },
    include: { variants: true },
  });

  if (!product) return null;

  // Convert Decimal fields to string
  return JSON.parse(JSON.stringify(serializeProduct(product)));
};

// Get all products
export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
  });

  const data = products.map(serializeProduct);

  return { data };
};
