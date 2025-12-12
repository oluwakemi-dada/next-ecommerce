'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingIcon from '@/components/shared/loading-icon';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import { useCartStore } from '@/store/cart-store';

type CartTableRowProps = {
  item: CartItem;
};

const CartTableRow = ({ item }: CartTableRowProps) => {
  const setCart = useCartStore((state) => state.setCart);
  const [loading, setLoading] = useState<null | 'add' | 'remove'>(null);

  const handleRemove = async () => {
    setLoading('remove');

    try {
      const res = await removeItemFromCart(
        item.productId,
        item.variantId ?? '',
      );

      if (!res.success) {
        toast.error(res.message);
      } else if (res.cart) {
        setCart(res.cart);
        toast.success(res.message);
      }
    } catch (error) {
      console.error('Remove from cart failed:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(null);
    }
  };

  const handleAdd = async () => {
    setLoading('add');

    try {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
      } else if (res.cart) {
        setCart(res.cart);
        toast.success(res.message);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-5 py-6">
      <div className="flex items-start">
        <Link href={`/product/${item.slug}`}>
          <Image src={item.image} alt={item.name} width={120} height={120} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-y-2">
        <div className="font-semibold">{item.name}</div>
        {item.size && <div>Size: {item.size}</div>}
        {item.color && (
          <div className="flex mb-2">
            <div>Color: </div>
            <div
              className="h-6 w-6 rounded-full ml-2"
              style={{ backgroundColor: item.color }}
            ></div>
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={loading !== null}
              onClick={handleRemove}
              className="cursor-pointer"
            >
              <LoadingIcon pending={loading === 'remove'} Icon={Minus} />
            </Button>

            <span>{item.qty}</span>

            <Button
              variant="outline"
              disabled={loading !== null}
              onClick={handleAdd}
              className="cursor-pointer"
            >
              <LoadingIcon pending={loading === 'add'} Icon={Plus} />
            </Button>
          </div>

          <div className="text-right font-semibold">${item.price}</div>
        </div>
      </div>
    </div>
  );
};

export default CartTableRow;
