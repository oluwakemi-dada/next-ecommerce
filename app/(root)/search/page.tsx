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
    sort?: string;
    rating?: string;
    page: string;
  }>;
};

export type GetFilterUrlProps = {
  c?: string;
  p?: string;
  s?: string;
  r?: string;
  pg?: string;
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

  // Construct filter url
  const getFilterUrl = ({ c, p, r, s, pg }: GetFilterUrlProps) => {
    const params = {
      q,
      category,
      price,
      sort,
      rating,
      page: page || '1',
    };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <SearchFilters
        category={category}
        price={price}
        rating={rating}
        getFilterUrl={getFilterUrl}
      />

      <div className="space-y-4 md:col-span-4">
        <SearchHeader
          q={q}
          category={category}
          price={price}
          rating={rating}
          sort={sort}
          getFilterUrl={getFilterUrl}
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
