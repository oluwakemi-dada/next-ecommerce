import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type PaymentMethodCardProps = {
  paymentMethod: string;
};

const PaymentMethodCard = ({ paymentMethod }: PaymentMethodCardProps) => {
  return (
    <Card className="py-0">
      <CardContent className="gap-4 p-4">
        <h2 className="pb-4 text-xl">Payment Method</h2>
        <p>{paymentMethod}</p>
        <div className="mt-3">
          <Link href="/payment-method">
            <Button variant="outline" size="sm" className="cursor-pointer">
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
