import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { TableRow, TableCell } from '@/components/ui/table';
import IconOrLoader from '@/components/shared/icon-or-loader';
import Image from 'next/image';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';

type CartTableRowProps = {
  item: CartItem;
};

const CartTableRow = ({ item }: CartTableRowProps) => {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'add' | 'remove' | null>(null);

  return (
    <TableRow key={item.slug}>
      <TableCell>
        <Link href={`/product/${item.slug}`} className="flex items-center">
          <Image src={item.image} alt={item.name} width={50} height={50} />
          <span className="px-2">{item.name}</span>
        </Link>
      </TableCell>
      <TableCell className="flex-center gap-2">
        <Button
          disabled={isPending}
          variant="outline"
          type="button"
          onClick={() => {
            setActionType('remove');
            startTransition(async () => {
              const res = await removeItemFromCart(item.productId);

              if (!res.success) {
                toast.error(res.message);
              }
            });
          }}
          aria-disabled={isPending}
        >
          <IconOrLoader
            pending={isPending && actionType === 'remove'}
            Icon={Minus}
          />
        </Button>
        <span>{item.qty}</span>
        <Button
          disabled={isPending}
          variant="outline"
          type="button"
          onClick={() => {
            setActionType('add');
            startTransition(async () => {
              const res = await addItemToCart(item);

              if (!res.success) {
                toast.error(res.message);
              }
            });
          }}
          aria-disabled={isPending}
        >
          <IconOrLoader
            pending={isPending && actionType === 'add'}
            Icon={Plus}
            key="plus"
          />
        </Button>
      </TableCell>
      <TableCell className="text-right">${item.price}</TableCell>
    </TableRow>
  );
};

export default CartTableRow;
