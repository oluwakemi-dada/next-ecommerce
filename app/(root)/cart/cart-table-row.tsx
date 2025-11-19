'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingIcon from '@/components/shared/loading-icon';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useCart } from '@/contexts/cart-context';
import { CartItem } from '@/types';

type CartTableRowProps = {
  item: CartItem;
};

const CartTableRow = ({ item }: CartTableRowProps) => {
  const { setCart } = useCart();
  const [loading, setLoading] = useState<null | 'add' | 'remove'>(null);

  const handleRemove = async () => {
    setLoading('remove');
    const res = await removeItemFromCart(item.productId, item.variantId ?? '');

    if (!res.success) toast.error(res.message);
    else if (res.cart) {
      setCart(res.cart);
      toast.success(res.message);
    }

    setLoading(null);
  };

  const handleAdd = async () => {
    setLoading('add');
    const res = await addItemToCart(item);

    if (!res.success) toast.error(res.message);
    else if (res.cart) {
      setCart(res.cart);
      toast.success(res.message);
    }

    setLoading(null);
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
        {item.color && <div>Color: {item.color}</div>}

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
