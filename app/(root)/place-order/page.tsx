import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { getUserById } from '@/lib/actions/user.actions';
import { getMyCart } from '@/lib/actions/cart.actions';
import { auth } from '@/auth';
import { ShippingAddress } from '@/types';
import ShippingAddressCard from './shipping-address-card';
import PaymentMethodCard from './payment-method-card';
import OrderItemsTable from './order-items-table';
import OrderSummaryCard from './order-summary-card';

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
          <ShippingAddressCard userAddress={userAddress} />
          <PaymentMethodCard paymentMethod={user.paymentMethod} />
          <OrderItemsTable cart={cart} />
        </div>
        <div>
          <OrderSummaryCard cart={cart} />
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
