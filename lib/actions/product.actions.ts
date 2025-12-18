'use server';
import z from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/db/prisma';
import {
  convertToPlainObject,
  formatError,
  generateVariantSKU,
  serializeProduct,
  validateVariants,
  validateVariantUniqueness,
} from '../utils';
import { insertProductSchema, updateProductSchema } from '../validators';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { Prisma } from '@prisma/client';

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

// Get single product by it's ID (admin)
export const getProductById = async (productId: string) => {
  const data = await prisma.product.findFirst({
    where: { id: productId },
    include: { variants: true },
  });

  if (!data) return null;

  return convertToPlainObject(data);
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
  price?: string;
  rating?: string;
  sort?: string;
};

// Get all products
export const getAllProducts = async ({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: GetAllProductsProps) => {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== 'all' ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
          ? { price: 'desc' }
          : sort === 'rating'
            ? { rating: 'desc' }
            : { createdAt: 'desc' },
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

// Create a product
export const createProduct = async (
  data: z.infer<typeof insertProductSchema>,
) => {
  try {
    const product = insertProductSchema.parse(data);
    const { variants, ...productData } = product;

    // Validate variants if they exist
    if (variants && variants.length > 0) {
      // Check color/size requirement
      const variantValidation = validateVariants(variants);
      if (!variantValidation.isValid) {
        throw new Error(variantValidation.errors.join('. '));
      }

      // Check uniqueness
      const uniqueValidation = validateVariantUniqueness(variants);
      if (!uniqueValidation.isValid) {
        throw new Error(
          `Duplicate variants found: ${uniqueValidation.duplicates.join(', ')}. Each color/size combination must be unique.`,
        );
      }
    }

    // Create product first to get the ID
    const createdProduct = await prisma.product.create({
      data: productData,
    });

    // If variants exist, create them with generated SKUs
    if (variants && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant) => ({
          ...variant,
          productId: createdProduct.id,
          sku: generateVariantSKU(productData.name, createdProduct.id, variant),
          price: variant.price ?? productData.price,
          stock: variant.stock ?? 0,
        })),
      });
    }

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

// Update a product
export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>,
) => {
  try {
    const product = updateProductSchema.parse(data);
    const { id, variants, ...productData } = product;

    // Find the product first to ensure it exists
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    if (variants && variants.length > 0) {
      // Check color/size requirement
      const variantValidation = validateVariants(variants);
      if (!variantValidation.isValid) {
        throw new Error(variantValidation.errors.join('. '));
      }

      // Check uniqueness
      const uniqueValidation = validateVariantUniqueness(variants);
      if (!uniqueValidation.isValid) {
        throw new Error(
          `Duplicate variants found: ${uniqueValidation.duplicates.join(', ')}. Each color/size combination must be unique.`,
        );
      }
    }

    // Use transaction for atomic update
    await prisma.$transaction(async (tx) => {
      // Update product
      await tx.product.update({
        where: { id },
        data: productData,
      });

      // Delete all existing variants
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      // Create new variants with generated SKUs
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((variant) => ({
            ...variant,
            productId: id,
            sku: generateVariantSKU(productData.name, id, variant),
            price: variant.price ?? productData.price,
            stock: variant.stock ?? 0,
          })),
        });
      }
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

// Get all categories
export const getAllCategories = async () => {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
};

// Get featured products
export const getFeaturedProducts = async () => {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
    include: { variants: true },
  });

  return convertToPlainObject(data);
};
