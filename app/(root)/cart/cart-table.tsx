'use client';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import CartTableRow from './cart-table-row';
import LoadingIcon from '@/components/shared/loading-icon';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/shared/loader';
import { useCartStore } from '@/store/cart-store';

const CartTable = () => {
  const cart = useCartStore((state) => state.cart);
  const cartLoading = useCartStore((state) => state.cartLoading);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (cartLoading) return <Loader />;

  if (!cart || cart.items.length === 0)
    return (
      <div>
        Cart is empty. <Link href="/">Go Shopping</Link>
      </div>
    );

  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-5 lg:gap-10">
      <div className="col-span-2">
        <h1 className="h2-bold mb-4 py-4">Shopping Cart</h1>
        <div className="divide-border flex flex-col divide-y overflow-x-auto md:col-span-2">
          {cart.items.map((item) => (
            <CartTableRow key={item.variantId ?? item.productId} item={item} />
          ))}
        </div>
      </div>
      <Card className="h-fit">
        <CardContent className="gap-4 p-4">
          <div className="pb-3 text-xl">
            SubTotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)}):{' '}
            <span className="font-bold">{formatCurrency(cart.itemsPrice)}</span>
          </div>
          <Button
            className="w-full cursor-pointer"
            disabled={isPending}
            onClick={() =>
              startTransition(() => router.push('/shipping-address'))
            }
          >
            <LoadingIcon pending={isPending} Icon={ArrowRight} /> Proceed To
            Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartTable;
