'use server';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { PrismaClient } from '../generated/prisma';
import { convertToPlainObject } from '../utils';

// Get latests products
export const getLatestProducts = async () => {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
};
