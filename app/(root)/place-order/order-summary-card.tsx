import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import PlaceOrderForm from './place-order-form';

type OrderSummaryProps = {
  cart: Cart;
};
const OrderSummaryCard = ({ cart }: OrderSummaryProps) => {
  return (
    <Card className="py-0">
      <CardContent className="gap-4 space-y-4 p-4">
        <div className="flex justify-between">
          <div>Items</div>
          <div>{formatCurrency(cart.itemsPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Tax</div>
          <div>{formatCurrency(cart.taxPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Shipping</div>
          <div>{formatCurrency(cart.shippingPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Total</div>
          <div>{formatCurrency(cart.totalPrice)}</div>
        </div>
        <PlaceOrderForm />
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
