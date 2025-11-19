import { Product } from '@/types';
import ProductPrice from '../../../../components/shared/product/product-price';

type ProductInfoProps = {
  product: Product;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <p>
          {product.brand} {product.category}
        </p>
        <h1 className="h3-bold">{product.name}</h1>
        <p>
          {product.rating} of {product.numReviews} Reviews
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ProductPrice
            value={Number(product.price)}
            className="w-24 rounded-full bg-green-100 px-5 py-2 text-green-700"
          />
        </div>
      </div>

      <div className="mt-7 mb-5">
        <p className="font-semibold">Description</p>
        <p>{product.description}</p>
      </div>
    </>
  );
};

export default ProductInfo;
