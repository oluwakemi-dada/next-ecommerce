'use client';
import { useState, useTransition } from 'react';
import { Plus, Minus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';

type AddToCartProps = { cart?: Cart; item: CartItem; outOfStock: boolean };

const AddToCart = ({ cart, item, outOfStock }: AddToCartProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);

  // Handle add from cart
  const handleAddToCart = async () => {
    setActionType('add');
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res?.success) {
        toast.error(res.message);
        return;
      }

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

      toast.success(res.message);
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const IconOrLoader = ({ pending, Icon }: { pending: boolean; Icon: any }) =>
    pending ? (
      <Loader className="h-4 w-4 animate-spin" />
    ) : (
      <Icon className="h-4 w-4" />
    );

  return existItem ? (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        <IconOrLoader
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
      >
        <IconOrLoader pending={isPending && actionType === 'add'} Icon={Plus} />
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      className="w-full cursor-pointer"
      onClick={handleAddToCart}
      disabled={outOfStock || isPending}
    >
      <IconOrLoader pending={isPending && actionType === 'add'} Icon={Plus} />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
