import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts } from '@/lib/actions/product.actions';

type SearchResultsProps = {
  q: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  page: number;
};

const SearchResults = async ({
  q,
  category,
  price,
  rating,
  sort,
  page,
}: SearchResultsProps) => {
  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page,
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {products.data.length === 0 && <div>No products found</div>}
      {products.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SearchResults;
