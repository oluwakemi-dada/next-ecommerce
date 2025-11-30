import { Metadata } from 'next';
import ShippingAddressDataLoader from './shipping-address-data-loader';
import { Suspense } from 'react';
import CheckoutSteps from '@/components/shared/checkout-steps';
import Loader from '@/components/shared/loader';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  return (
    <>
      <CheckoutSteps current={1} />
      <Suspense fallback={<Loader />}>
        <ShippingAddressDataLoader />;
      </Suspense>
    </>
  );
};

export default ShippingAddressPage;
