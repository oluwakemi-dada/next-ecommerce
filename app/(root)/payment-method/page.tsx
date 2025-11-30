import { Metadata } from 'next';
import PaymentMethodDataLoader from './payment-method-data-loader';
import { Suspense } from 'react';
import Loader from '@/components/shared/loader';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
  title: 'Select Payment Method',
};

const PaymentMethodPage = async () => {
  return (
    <>
      <CheckoutSteps current={2} />
      <Suspense fallback={<Loader />}>
        <PaymentMethodDataLoader />
      </Suspense>
    </>
  );
};

export default PaymentMethodPage;
