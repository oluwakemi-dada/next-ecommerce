'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import CartTableRow from './cart-table-row';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/shared/loading-icon';
import { ArrowRight } from 'lucide-react';
import { getMyCart } from '@/lib/actions/cart.actions';
import Loader from '@/components/shared/loader';

const CartTable = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useState<Cart | undefined>(undefined);

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

  if (!cart) return <Loader />;

  return (
    <>
      <h1 className="h2-bold mb-4 py-4">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-3 md:gap-5 lg:gap-10">
          <div className="divide-border flex flex-col divide-y overflow-x-auto md:col-span-2">
            {cart.items.map((item) => (
              <CartTableRow
                item={item}
                key={item.variantId ? item.variantId : item.productId}
                setCart={(newCart) => setCart(newCart)}
              />
            ))}
          </div>

          <Card className="h-fit">
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
