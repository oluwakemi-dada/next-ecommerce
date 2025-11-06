import Loader from '@/components/shared/loader';
import ProductList from '@/components/shared/product/product-list';
import { Suspense } from 'react';

const HomePage = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <ProductList title="Newest Arrivals" limit={4} />
      </Suspense>
    </>
  );
};

export default HomePage;
