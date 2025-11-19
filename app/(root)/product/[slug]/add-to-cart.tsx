'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/shared/loading-icon';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { CartItem, Product, VariantInput } from '@/types';
import ProductSelector from './product-selector';
import Loader from '@/components/shared/loader';
import { useCart } from '@/contexts/cart-context';

type AddToCartProps = {
  product: Product;
  outOfStock: boolean;
};

const AddToCart = ({ product, outOfStock }: AddToCartProps) => {
  const router = useRouter();
  const { cart, setCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);

  const hasVariants = product.variants.length > 0;

  const defaultVariant = hasVariants
    ? product.variants.find((v) => v.stock > 0) || product.variants[0]
    : undefined;

  const [selectedVariant, setSelectedVariant] = useState<
    VariantInput | undefined
  >(defaultVariant);

  if (!cart) return <Loader />;

  const item: CartItem = {
    productId: product.id,
    variantId: hasVariants ? selectedVariant?.sku : undefined,
    name: product.name,
    slug: product.slug,
    price: hasVariants
      ? (selectedVariant?.price ?? product.price)
      : product.price,
    image: hasVariants
      ? (selectedVariant?.image ?? product.images[0])
      : product.images[0],
    size: hasVariants ? (selectedVariant?.size ?? undefined) : undefined,
    color: hasVariants ? (selectedVariant?.color ?? undefined) : undefined,
    qty: 1,
  };

  const existItem = cart.items.find((x) =>
    hasVariants
      ? x.productId === item.productId && x.variantId === item.variantId
      : x.productId === item.productId,
  );

  const handleAddToCart = async () => {
    setActionType('add');
    setLoading(true);

    const res = await addItemToCart(item);
    setLoading(false);

    if (!res.success) return toast.error(res.message);
    if (res.cart) setCart(res.cart);

    toast.success(res.message, {
      action: (
        <Button
          className="bg-primary cursor-pointer text-white hover:bg-gray-800"
          onClick={() => router.push('/cart')}
        >
          Go To Cart
        </Button>
      ),
    });
  };

  const handleRemoveFromCart = async () => {
    setActionType('remove');
    setLoading(true);

    const res = await removeItemFromCart(item.productId, item.variantId ?? '');

    setLoading(false);

    if (!res.success) return toast.error(res.message);
    if (res.cart) setCart(res.cart);

    toast.success(res.message);
  };

  return (
    <div>
      {hasVariants && (
        <ProductSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
        />
      )}

      <div className="mt-7">
        {existItem ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveFromCart}
              disabled={loading}
            >
              <LoadingIcon
                pending={loading && actionType === 'remove'}
                Icon={Minus}
              />
            </Button>

            <span className="px-2">{existItem.qty}</span>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <LoadingIcon
                pending={loading && actionType === 'add'}
                Icon={Plus}
              />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="w-full cursor-pointer"
            onClick={handleAddToCart}
            disabled={outOfStock || loading}
          >
            <LoadingIcon
              pending={loading && actionType === 'add'}
              Icon={Plus}
            />
            Add To Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
