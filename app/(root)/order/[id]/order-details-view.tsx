import Stripe from 'stripe';
import { notFound } from 'next/navigation';
import PaymentMethodCard from '@/components/shared/order/payment-method-card';
import OrderSummaryCard from '@/components/shared/order/order-summary-card';
import ShippingAddressCard from '@/components/shared/order/shipping-address-card';
import OrderItemsTable from '@/components/shared/order/order-items-table';
import { getOrderById } from '@/lib/actions/order.actions';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import PayPalPayment from './paypal-payment';
import { MarkAsPaidButton, MarkAsDeliveredButton } from './admin-order-buttons';
import StripePayment from './stripe-payment';

type OrderDetailsViewProps = {
  id: string;
};

const OrderDetailsView = async ({ id }: OrderDetailsViewProps) => {
  const order = await getOrderById(id);

  const session = await auth();

  const isAdmin = session?.user.role === 'admin' || false;

  if (!order) notFound();

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <PaymentMethodCard
            paymentMethod={order.paymentMethod}
            isPaid={order.isPaid}
            paidAt={order.paidAt}
          />
          <ShippingAddressCard
            shippingDetails={{
              shippingAddress: order.shippingAddress as ShippingAddress,
              isDelivered: order.isDelivered,
              deliveredAt: order.deliveredAt,
            }}
          />
          <OrderItemsTable items={order.orderitems} />
        </div>

        <div>
          <OrderSummaryCard
            prices={{
              itemsPrice: order.itemsPrice,
              taxPrice: order.taxPrice,
              shippingPrice: order.shippingPrice,
              totalPrice: order.totalPrice,
            }}
          >
            {session?.user.id === order.user.id && (
              <>
                {/* PayPal Payment */}
                {!order.isPaid && order.paymentMethod === 'PayPal' && (
                  <PayPalPayment
                    order={{
                      id: order.id,
                    }}
                    paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                  />
                )}

                {/* Stripe Payment */}
                {!order.isPaid && order.paymentMethod === 'Stripe' && (
                  <StripePayment
                    orderId={order.id}
                    priceInCents={Number(order.totalPrice) * 100}
                    clientSecret={client_secret}
                  />
                )}
              </>
            )}

            {/* Cash On Delivery */}
            {isAdmin &&
              !order.isPaid &&
              order.paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton
                  order={{
                    id: order.id,
                  }}
                />
              )}

            {isAdmin && order.isPaid && !order.isDelivered && (
              <MarkAsDeliveredButton
                order={{
                  id: order.id,
                }}
              />
            )}
          </OrderSummaryCard>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsView;
