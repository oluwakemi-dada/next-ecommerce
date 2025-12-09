'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { formatError, serializeProduct } from '../utils';
import { revalidatePath } from 'next/cache';

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

// Get all products (for static params)
export const getAllProductsRaw = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
  });

  const data = products.map(serializeProduct);

  return { data };
};

type GetAllProductsProps = {
  query: string;
  limit?: number;
  page: number;
  category?: string;
};

// Get all products
export const getAllProducts = async ({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: GetAllProductsProps) => {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: { variants: true },
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
