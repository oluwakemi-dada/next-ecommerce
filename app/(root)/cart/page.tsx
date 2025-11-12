import { Suspense } from 'react';
import CartTableWrapper from './cart-table-wrapper';
import Loader from '@/components/shared/loader';

export const metadata = {
  title: 'Shopping Cart',
};

const CartPage = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <CartTableWrapper />
      </Suspense>
    </>
  );
};

export default CartPage;
