import { Suspense } from 'react';
import ProductDetails from '@/app/(root)/product/[slug]/product-details';
import Loader from '@/components/shared/loader';
import { getAllProductsRaw } from '@/lib/actions/product.actions';
import ReviewListWrapper from './review-list-wrapper';

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

// Cache for 1 hour
export const revalidate = 3600;

// For builds
export const generateStaticParams = async () => {
  const products = await getAllProductsRaw();

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
      <section className="mt-10">
        <ReviewListWrapper productSlug={slug} />
      </section>
    </>
  );
};

export default ProductDetailsPage;
