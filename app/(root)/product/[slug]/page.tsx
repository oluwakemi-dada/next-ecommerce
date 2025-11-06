import { Suspense } from 'react';
import ProductDetails from '@/components/shared/product/product-details';
import Loader from '@/components/shared/loader';

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;

  return (
    <>
      <section>
        <Suspense fallback={<Loader />}>
          <ProductDetails slug={slug} />
        </Suspense>
      </section>
    </>
  );
};

export default ProductDetailsPage;
