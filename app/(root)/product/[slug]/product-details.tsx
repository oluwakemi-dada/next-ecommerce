import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/actions/product.actions';
import ProductActionCard from './product-action-card';
import ProductImages from './product-images';
import ProductInfo from './product-info';

type ProductDetailsProps = {
  slug: string;
};

const ProductDetails = async ({ slug }: ProductDetailsProps) => {
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className="col-span-2">
        <ProductImages images={product.images} />
      </div>

      <div className="col-span-2 p-5">
        <ProductInfo product={product} />
      </div>

      <ProductActionCard product={product} />
    </div>
  );
};

export default ProductDetails;
