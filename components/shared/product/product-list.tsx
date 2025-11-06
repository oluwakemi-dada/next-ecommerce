import { Product } from '@/types';
import ProductCard from './product-card';
import { getLatestProducts } from '@/lib/actions/product.actions';

type ProductListProps = {
  title?: string;
  limit?: number;
};

const ProductList = async ({ title, limit }: ProductListProps) => {
  const latestProducts = await getLatestProducts();
  const limitedData = limit ? latestProducts.slice(0, limit) : latestProducts;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {latestProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
