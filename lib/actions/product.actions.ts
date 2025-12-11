'use server';
import z from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/db/prisma';
import {
  formatError,
  generateVariantSKU,
  serializeProduct,
  validateVariants,
  validateVariantUniqueness,
} from '../utils';
import { insertProductSchema, updateProductSchema } from '../validators';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';

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
    orderBy: {
      createdAt: 'desc',
    },
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
