import { getAllCategories } from '@/lib/actions/product.actions';

type SearchFiltersProps = {
  category: string;
  price: string;
  rating: string;
  // getFilterUrl: (params: { c?: string; p?: string; r?: string }) => string;
};

const SearchFilters = async ({
  category,
  price,
  rating,
  // getFilterUrl,
}: SearchFiltersProps) => {
  const categories = await getAllCategories();
  return (
    <div className="filter-links">
      <div className="mt-3 mb-2 text-xl">Department</div>
    </div>
  );
};

export default SearchFilters;
