import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { ShippingAddress } from '@/types';

type ShippingDetails = {
  shippingAddress: ShippingAddress;
  isDelivered: boolean;
  deliveredAt: Date | null;
};

type ShippingAddressCardProps = {
  userAddress?: ShippingAddress; // for editable card
  shippingDetails?: ShippingDetails; // for delivery status card
  children?: React.ReactNode;
};

const ShippingAddressCard = ({
  userAddress,
  shippingDetails,
  children,
}: ShippingAddressCardProps) => {
  const address = userAddress ?? shippingDetails?.shippingAddress;

  if (!address) return null;

  return (
    <Card className="py-0">
      <CardContent className="gap-4 p-4">
        <h2 className="pb-4 text-xl">Shipping Address</h2>
        <p>{address.fullName}</p>
        <p className="mb-2">
          {address.streetAddress}, {address.city} {address.postalCode},{' '}
          {address.country}
        </p>

        {/* Delivery status */}
        {shippingDetails && (
          <div className="mb-2">
            {shippingDetails.isDelivered ? (
              <Badge variant="secondary">
                Delivered at{' '}
                {formatDateTime(shippingDetails.deliveredAt!).dateTime}
              </Badge>
            ) : (
              <Badge variant="destructive">Not Delivered</Badge>
            )}
          </div>
        )}

        {/* Editable button */}
        {userAddress && children ? (
          <div className="mt-3">{children}</div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ShippingAddressCard;
