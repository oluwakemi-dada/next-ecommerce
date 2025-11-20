'use server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

export const getMyCart = async () => {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from database
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionCartId,
          userId,
          items: [],
          itemsPrice: 0,
          totalPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
        },
      });
    }

    // Convert decimals and return
    return convertToPlainObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    });
  } catch (error) {
    console.error('Error fetching cart:', error);

    // Return empty cart on any error so client can render safely
    const fallbackCartId = crypto.randomUUID();
    return {
      items: [] as CartItem[],
      itemsPrice: '0',
      totalPrice: '0',
      shippingPrice: '0',
      taxPrice: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
      sessionCartId: fallbackCartId,
      userId: undefined,
    };
  }
};

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: CartItem) => {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Determine if product has variants
    const hasVariants = !!item.variantId;
    let variant;
    let product;
    let itemName: string;
    let availableStock: number;

    if (hasVariants) {
      // Fetch the variant instead of just the product
      variant = await prisma.productVariant.findFirst({
        where: {
          productId: item.productId,
          size: item.size ?? null,
          color: item.color ?? null,
          isActive: true,
        },
      });

      product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!variant) throw new Error('Product variant not found');
      if (variant.stock < 1) throw new Error('Variant is out of stock');

      itemName = product ? product?.name : variant.sku;
      availableStock = variant.stock;
    } else {
      // No variant — fetch the product itself
      product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error('Product not found');
      if ((product.stock ?? 0) < 1) throw new Error('Product is out of stock');

      itemName = product.name;
      availableStock = product.stock ?? 0;
    }

    const productIdForRevalidation = hasVariants
      ? variant!.productId
      : product!.id;

    // Check if item exists in cart
    const existItem = cart.items.find(
      (x) =>
        x.productId === item.productId &&
        x.size === item.size &&
        x.color === item.color,
    );

    if (existItem) {
      if (availableStock < existItem.qty + 1)
        throw new Error('Not enough stock');
      existItem.qty += 1;
    } else {
      cart.items.push(item);
    }

    // Only update if the cart exists in DB
    if ('id' in cart && cart.id) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { items: cart.items, ...calcPrice(cart.items) },
      });
    } else {
      // Otherwise, create a new cart
      const newCart = insertCartSchema.parse({
        userId,
        items: cart.items,
        sessionCartId: cart.sessionCartId,
        ...calcPrice(cart.items),
      });

      await prisma.cart.create({ data: newCart });
    }

    // Revalidate product page
    revalidatePath(`/product/${productIdForRevalidation}`);

    // Fetch updated cart
    const updatedCart = await getMyCart();

    return {
      success: true,
      message: `${itemName} ${existItem ? 'updated in' : 'added to'} cart`,
      cart: updatedCart,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const removeItemFromCart = async (
  productId: string,
  variantId: string,
) => {
  try {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Normalize variantId (treat empty string as null/undefined for comparison)
    const normalizedVariantId =
      variantId && variantId.trim() !== '' ? variantId : null;

    // Check for Item - handle both variant and non-variant products
    const exist = (cart.items as CartItem[]).find((x) => {
      const itemVariantId =
        x.variantId && x.variantId.trim() !== '' ? x.variantId : null;
      return x.productId === productId && itemVariantId === normalizedVariantId;
    });

    if (!exist) throw new Error('Item not found');

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from the cart
      cart.items = (cart.items as CartItem[]).filter((x) => {
        const itemVariantId =
          x.variantId && x.variantId.trim() !== '' ? x.variantId : null;
        return !(
          x.productId === productId && itemVariantId === normalizedVariantId
        );
      });
    } else {
      // Decrease the qty
      exist.qty = exist.qty - 1;
    }

    if ('id' in cart && cart.id) {
      // Update cart in database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });
    }

    // Fetch and return the updated cart
    const updatedCart = await getMyCart();
    return {
      success: true,
      message: `Item removed from cart`,
      cart: updatedCart,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
