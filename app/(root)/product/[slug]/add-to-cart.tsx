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
import { Cart, CartItem } from '@/types';
import Loader from '@/components/shared/loader';

type AddToCartProps = { item: CartItem; outOfStock: boolean };

const AddToCart = ({ item, outOfStock }: AddToCartProps) => {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);

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

  // Early return while loading
  if (!cart) return <Loader />;

  // Handle add from cart
  const handleAddToCart = async () => {
    setActionType('add');
    startTransition(async () => {
      const res = await addItemToCart(item);

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
      const res = await removeItemFromCart(item.productId);

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
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
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
        <LoadingIcon pending={isPending && actionType === 'add'} Icon={Plus} />
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
      <LoadingIcon pending={isPending && actionType === 'add'} Icon={Plus} />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
