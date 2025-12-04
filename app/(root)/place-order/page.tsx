export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CheckoutSteps from '@/components/shared/checkout-steps';
import OrderSummaryCard from '@/components/shared/order/order-summary-card';
import { getUserById } from '@/lib/actions/user.actions';
import { getMyCart } from '@/lib/actions/cart.actions';
import { auth } from '@/auth';
import { ShippingAddress } from '@/types';
import ShippingAddressCard from '../../../components/shared/order/shipping-address-card';
import PaymentMethodCard from '../../../components/shared/order/payment-method-card';
import OrderItemsTable from '../../../components/shared/order/order-items-table';
import PlaceOrderForm from './place-order-form';

export const metadata: Metadata = {
  title: 'Place Order',
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="space-y-4 overflow-x-auto md:col-span-2">
          <ShippingAddressCard userAddress={userAddress}>
            <Link href="/shipping-address">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Edit
              </Button>
            </Link>
          </ShippingAddressCard>
          <PaymentMethodCard
            paymentMethod={user.paymentMethod}
            editable={true}
            editHref="/payment-method"
          />
          <OrderItemsTable items={cart.items} />
        </div>
        <div>
          <OrderSummaryCard cart={cart}>
            <PlaceOrderForm />
          </OrderSummaryCard>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
