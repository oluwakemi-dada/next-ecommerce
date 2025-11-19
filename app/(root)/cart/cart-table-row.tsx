'use client';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import LoadingIcon from '@/components/shared/loading-icon';
import Image from 'next/image';
import {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
} from '@/lib/actions/cart.actions';
import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';

type CartTableRowProps = {
  item: CartItem;
  setCart: (newcart: Cart) => void;
};

const CartTableRow = ({ item, setCart }: CartTableRowProps) => {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);

  return (
    <div key={item.slug} className="flex gap-5 py-6">
      <div className="flex items-start">
        <Link href={`/product/${item.slug}`}>
          <Image src={item.image} alt={item.name} width={120} height={120} />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-y-2">
        <div className="font-semibold">{item.name}</div>
        <div>Size: {item.size}</div>
        <div>Color: {item.color}</div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setActionType('remove');
                startTransition(async () => {
                  const res = await removeItemFromCart(
                    item.productId,
                    item.variantId ?? '',
                  );

                  if (!res.success) {
                    toast.error(res.message);
                    return;
                  }

                  if (res.cart) {
                    setCart(res.cart); 
                  }

                  toast.success(res.message);
                });
              }}
              aria-disabled={isPending}
            >
              <LoadingIcon
                pending={isPending && actionType === 'remove'}
                Icon={Minus}
              />
            </Button>
            <span>{item.qty}</span>
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setActionType('add');
                startTransition(async () => {
                  const res = await addItemToCart(item);

                  if (!res.success) {
                    toast.error(res.message);
                    return;
                  }

                  if (res.cart) {
                    setCart(res.cart);
                  }

                  // Handle success add to cart
                  toast.success(res.message);
                });
              }}
              aria-disabled={isPending}
            >
              <LoadingIcon
                pending={isPending && actionType === 'add'}
                Icon={Plus}
                key="plus"
              />
            </Button>
          </div>
          <div className="text-right font-semibold">${item.price}</div>
        </div>
      </div>
    </div>
  );
};

export default CartTableRow;
