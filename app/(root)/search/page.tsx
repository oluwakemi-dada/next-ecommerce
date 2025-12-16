import Loader from '@/components/shared/loader';
import { Suspense } from 'react';
import SearchResults from './search-results';
import SearchHeader from './search-header';
import SearchFilters from './search-filters';

type SearchPageProps = {
  searchParams: Promise<{
    q: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page: string;
  }>;
};

const SearchPage = async (props: SearchPageProps) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page,
  } = await props.searchParams;

  const pageNumber = Number(page) || 1;

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <Suspense fallback={<Loader />}>
        <SearchFilters
          category={category}
          price={price}
          rating={rating}
          // getFilterUrl={getFilterUrl}
        />
      </Suspense>

      <div className="space-y-4 md:col-span-4">
        <SearchHeader
          q={q}
          category={category}
          price={price}
          rating={rating}
          sort={sort}
          // getFilterUrl={getFilterUrl}
        />

        <Suspense fallback={<Loader />}>
          <SearchResults
            q={q}
            category={category}
            price={price}
            rating={rating}
            sort={sort}
            page={pageNumber}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default SearchPage;
