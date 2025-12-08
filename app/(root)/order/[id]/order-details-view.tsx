import { notFound } from 'next/navigation';
import PaymentMethodCard from '@/components/shared/order/payment-method-card';
import OrderSummaryCard from '@/components/shared/order/order-summary-card';
import ShippingAddressCard from '@/components/shared/order/shipping-address-card';
import OrderItemsTable from '@/components/shared/order/order-items-table';
import { getOrderById } from '@/lib/actions/order.actions';
import { ShippingAddress } from '@/types';
import PayPalPayment from './paypal-payment';
import { auth } from '@/auth';

type OrderDetailsViewProps = {
  id: string;
};

const OrderDetailsView = async ({ id }: OrderDetailsViewProps) => {
  const order = await getOrderById(id);

  const session = await auth();

  if (!order) notFound();

  const {
    user,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <PaymentMethodCard
            paymentMethod={paymentMethod}
            isPaid={isPaid}
            paidAt={paidAt}
          />
          <ShippingAddressCard
            shippingDetails={{
              shippingAddress: shippingAddress as ShippingAddress,
              isDelivered,
              deliveredAt,
            }}
          />
          <OrderItemsTable items={orderitems} />
        </div>

        <div>
          <OrderSummaryCard
            prices={{ itemsPrice, taxPrice, shippingPrice, totalPrice }}
          >
            {session?.user.id === user.id && (
              <>
                {/* PayPal Payment */}
                {!isPaid && paymentMethod === 'PayPal' && (
                  <PayPalPayment
                    order={{
                      id: order.id,
                    }}
                    paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                  />
                )}

                {/* Stripe Payment */}

                {/* Cash On Delivery */}
              </>
            )}
          </OrderSummaryCard>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsView;
