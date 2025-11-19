'use server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

export const getMyCart = async () => {
  // Check for the cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
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

    // Fetch the variant instead of just the product
    const variant = await prisma.productVariant.findFirst({
      where: {
        productId: item.productId,
        size: item.size ?? null,
        color: item.color ?? null,
        isActive: true,
      },
    });

    if (!variant) throw new Error('Product variant not found');
    if (variant.stock < 1) throw new Error('Variant is out of stock');

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${variant.productId}`);

      return {
        success: true,
        message: `${variant.sku} added to cart`,
      };
    } else {
      // Check if same variant exists in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) =>
          x.productId === item.productId &&
          x.size === item.size &&
          x.color === item.color,
      );

      if (existItem) {
        if (variant.stock < existItem.qty + 1)
          throw new Error('Not enough stock');

        existItem.qty += 1;
      } else {
        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: { items: cart.items, ...calcPrice(cart.items as CartItem[]) },
      });

      revalidatePath(`/product/${variant.productId}`);

      const updatedCart = await getMyCart();
      return {
        success: true,
        message: `${variant.sku} ${existItem ? 'updated in' : 'added to'} cart`,
        cart: updatedCart,
      };
    }
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

    // Check for Item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId && x.variantId === variantId,
    );
    if (!exist) throw new Error('Item not found');

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from the cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => !(x.productId === productId && x.variantId === variantId),
      );
    } else {
      // Decrease the qty
      exist.qty = exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });

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
