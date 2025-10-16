import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductActionCard from '@/components/shared/product/product-action-card';
import ProductInfo from '@/components/shared/product/product-info';
import ProductImages from '@/components/shared/product/product-images';

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          <div className="col-span-2 p-5">
            <ProductInfo product={product} />
          </div>

          <ProductActionCard product={product} />
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
