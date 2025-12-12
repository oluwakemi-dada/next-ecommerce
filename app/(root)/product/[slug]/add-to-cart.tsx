'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/shared/loading-icon';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { CartItem, Product, Variant } from '@/types';
import ProductSelector from './product-selector';
import { useCartStore } from '@/store/cart-store';

type AddToCartProps = {
  product: Product;
  outOfStock: boolean;
};

const AddToCart = ({ product, outOfStock }: AddToCartProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const setCart = useCartStore((state) => state.setCart);

  const hasVariants = product.variants.length > 0;

  const defaultVariant = hasVariants
    ? product.variants.find((v) => v.stock > 0) || product.variants[0]
    : undefined;

  const [selectedVariant, setSelectedVariant] = useState<
    Variant | undefined
  >(defaultVariant);

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

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const res = await addItemToCart(item);

      if (!res.success) {
        return toast.error(res.message);
      }

      if (res.cart) {
        setCart(res.cart);
      }

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
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
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
        <Button
          type="button"
          className="w-full cursor-pointer"
          onClick={handleAddToCart}
          disabled={outOfStock || loading}
        >
          <LoadingIcon pending={loading} Icon={Plus} />
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default AddToCart;
