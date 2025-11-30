import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShippingAddress } from '@/types';

type ShippingAddressCardProps = {
  userAddress: ShippingAddress;
};

const ShippingAddressCard = ({ userAddress }: ShippingAddressCardProps) => {
  return (
    <Card className="py-0">
      <CardContent className="gap-4 p-4">
        <h2 className="pb-4 text-xl">Shipping Address</h2>
        <p>{userAddress.fullName}</p>
        <p>
          {userAddress.streetAddress}, {userAddress.city}{' '}
          {userAddress.postalCode}, {userAddress.country}
        </p>
        <div className="mt-3">
          <Link href="/shipping-address">
            <Button variant="outline" size="sm" className="cursor-pointer">
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingAddressCard;
