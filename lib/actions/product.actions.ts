'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { convertToPlainObject } from '../utils';

// Get latests products
export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
};

// Get single product by its slug
export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({
    where: {
      slug: slug,
    },
  });
};
