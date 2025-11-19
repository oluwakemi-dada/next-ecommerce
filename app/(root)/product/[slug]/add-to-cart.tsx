'use client';
import { useEffect, useState, useTransition } from 'react';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/shared/loading-icon';
import {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
} from '@/lib/actions/cart.actions';
import { Cart, CartItem, Product, VariantInput } from '@/types';
import ProductSelector from './product-selector';

type AddToCartProps = {
  product: Product;
  outOfStock: boolean;
};

const AddToCart = ({ product, outOfStock }: AddToCartProps) => {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);

  // pick the first in-stock variant OR fallback to first available
  const defaultVariant =
    product.variants.find((v) => v.stock > 0) || product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<
    VariantInput | undefined
  >(defaultVariant);

  useEffect(() => {
    let ignore = false;

    const fetchCart = async () => {
      try {
        const updatedCart = await getMyCart();
        if (!ignore) setCart(updatedCart);
      } catch (err) {
        if (!ignore) console.error(err);
      }
    };

    fetchCart();

    return () => {
      ignore = true;
    };
  }, []);

  if (!selectedVariant) return;

  const item: CartItem | undefined = selectedVariant && {
    productId: product.id,
    variantId: selectedVariant.sku,
    name: product.name,
    slug: product.slug,
    price: selectedVariant.price ?? '',
    image: selectedVariant.image ?? '',
    size: selectedVariant.size ?? undefined,
    color: selectedVariant.color ?? undefined,
    qty: 1,
  };

  // Early return while loading
  // if (!cart) return <Loader />;

  // Handle add from cart
  const handleAddToCart = async () => {
    setActionType('add');
    startTransition(async () => {
      const res = await addItemToCart(item!);

      if (!res?.success) {
        toast.error(res.message);
        return;
      }

      setCart(res.cart);

      // Handle success add to cart
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
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    setActionType('remove');
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId, item.variantId!);

      if (!res?.success) {
        toast.error(res.message);
        return;
      }

      setCart(res.cart);

      toast.success(res.message);
    });
  };

  // Check if item is in cart
  const existItem =
    cart &&
    cart.items.find(
      (x) => x.productId === item.productId && x.variantId === item.variantId,
    );

  return (
    <div>
      <div>
        <ProductSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
        />
      </div>
      {existItem ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={handleRemoveFromCart}
            disabled={isPending}
            aria-disabled={isPending}
          >
            <LoadingIcon
              pending={isPending && actionType === 'remove'}
              Icon={Minus}
            />
          </Button>

          <span className="px-2">{existItem.qty}</span>

          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={handleAddToCart}
            disabled={isPending}
            aria-disabled={isPending}
          >
            <LoadingIcon
              pending={isPending && actionType === 'add'}
              Icon={Plus}
            />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          className="w-full cursor-pointer"
          onClick={handleAddToCart}
          disabled={outOfStock || isPending}
          aria-disabled={outOfStock || isPending}
        >
          <LoadingIcon
            pending={isPending && actionType === 'add'}
            Icon={Plus}
          />
          Add To Cart
        </Button>
      )}
    </div>
  );
};

export default AddToCart;
