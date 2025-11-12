'use client';
import { useTransition } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import CartTableRow from './cart-table-row';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/shared/icon-or-loader';
import { ArrowRight } from 'lucide-react';

type CartTableProps = {
  cart?: Cart;
};

const CartTable = ({ cart }: CartTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="h2-bold py-4">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <CartTableRow item={item} key={item.productId} />
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="gap-4 p-4">
              <div className="pb-3 text-xl">
                SubTotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)}
                ):{' '}
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full cursor-pointer"
                disabled={isPending}
                onClick={() => {
                  startTransition(() => router.push('/shipping-address'));
                }}
                aria-disabled={isPending}
              >
                <LoadingIcon pending={isPending} Icon={ArrowRight} /> Proceed To
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
