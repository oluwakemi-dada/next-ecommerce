import { notFound } from 'next/navigation';
import PaymentMethodCard from '@/components/shared/order/payment-method-card';
import OrderSummaryCard from '@/components/shared/order/order-summary-card';
import ShippingAddressCard from '@/components/shared/order/shipping-address-card';
import OrderItemsTable from '@/components/shared/order/order-items-table';
import { getOrderById } from '@/lib/actions/order.actions';
import { ShippingAddress } from '@/types';

type OrderDetailsContentProps = {
  id: string;
};

const OrderDetailsContent = async ({ id }: OrderDetailsContentProps) => {
  const order = await getOrderById(id);

  if (!order) notFound();

  const {
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
            {/* PayPal Payment */}

            {/* Stripe Payment */}

            {/* Cash On Delivery */}
          </OrderSummaryCard>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsContent;
