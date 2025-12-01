import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';

type Prices = {
  itemsPrice: number | string;
  taxPrice: number | string;
  shippingPrice: number | string;
  totalPrice: number | string;
};

type OrderSummaryProps = {
  cart?: Cart;
  prices?: Prices;
  children?: ReactNode;
};

const OrderSummaryCard = ({ cart, prices, children }: OrderSummaryProps) => {
  const displayPrices: Prices = cart
    ? {
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }
    : prices!;

  return (
    <Card className="py-0">
      <CardContent className="gap-4 space-y-4 p-4">
        <div className="flex justify-between">
          <div>Items</div>
          <div>{formatCurrency(displayPrices.itemsPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Tax</div>
          <div>{formatCurrency(displayPrices.taxPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Shipping</div>
          <div>{formatCurrency(displayPrices.shippingPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Total</div>
          <div>{formatCurrency(displayPrices.totalPrice)}</div>
        </div>
        
        {children && children}
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
