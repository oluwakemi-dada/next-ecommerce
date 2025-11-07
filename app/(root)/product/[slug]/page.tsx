import { Suspense } from 'react';
import ProductDetails from '@/components/shared/product/product-details';
import Loader from '@/components/shared/loader';
import { getAllProducts } from '@/lib/actions/product.actions';

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

// Cache for 1 hour
export const revalidate = 3600;

// For builds
export const generateStaticParams = async () => {
  const products = await getAllProducts();

  const ids = products.data.map((product) => ({
    slug: product.slug,
  }));

  return ids;
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
