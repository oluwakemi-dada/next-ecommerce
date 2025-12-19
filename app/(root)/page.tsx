import { Suspense } from 'react';
import Loader from '@/components/shared/loader';
import ProductList from '@/components/shared/product/product-list';
import FeaturedProducts from '@/components/shared/product/featured-products';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/icon-boxes';

// Cache for 1 hour
export const revalidate = 3600;

const HomePage = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <ProductList title="Newest Arrivals" limit={6} />
      </Suspense>
      <ViewAllProductsButton />
      <IconBoxes />
    </>
  );
};

export default HomePage;
