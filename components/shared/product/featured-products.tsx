import { getFeaturedProducts } from '@/lib/actions/product.actions';
import ProductCarousel from './product-carousel';

const FeaturedProducts = async () => {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
    </>
  );
};

export default FeaturedProducts;
