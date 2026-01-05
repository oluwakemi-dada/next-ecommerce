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
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
        <ProductImages images={product.images} />
      </div>

      <div className="p-5">
        <ProductInfo product={product} />
        <ProductActionCard product={product} />
      </div>
    </div>
  );
};

export default ProductDetails;
