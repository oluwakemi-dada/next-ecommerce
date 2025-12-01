import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

type PaymentMethodCardProps = {
  paymentMethod: string;
  isPaid?: boolean;
  paidAt?: Date | null;
  editable?: boolean;
  editHref?: string;
};

const PaymentMethodCard = ({
  paymentMethod,
  isPaid,
  paidAt,
  editable = false,
  editHref = '/payment-method',
}: PaymentMethodCardProps) => {
  return (
    <Card className="py-0">
      <CardContent className="gap-4 p-4">
        <h2 className="pb-4 text-xl">Payment Method</h2>
        <p className="mb-2">{paymentMethod}</p>

        {isPaid !== undefined &&
          (isPaid ? (
            <Badge variant="secondary">
              Paid at {formatDateTime(paidAt!).dateTime}
            </Badge>
          ) : (
            <Badge variant="destructive">Not paid</Badge>
          ))}

        {editable && (
          <div className="mt-3">
            <Link href={editHref}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Edit
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
