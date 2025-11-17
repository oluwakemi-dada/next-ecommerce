import { Metadata } from 'next';
import ShippingAddressDataLoader from './shipping-address-data-loader';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  return (
    <>
      <ShippingAddressDataLoader />
    </>
  );
};

export default ShippingAddressPage;
