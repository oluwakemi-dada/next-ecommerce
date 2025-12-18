import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GetFilterUrlProps } from './page';
import FilterPill from './filter-pill';

type SearchHeaderProps = {
  q: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  getFilterUrl: ({ c, p, r, s, pg }: GetFilterUrlProps) => string;
};

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

const SearchHeader = ({
  q,
  category,
  price,
  rating,
  sort,
  getFilterUrl,
}: SearchHeaderProps) => {
  const hasActiveFilters =
    (q !== 'all' && q !== '') ||
    (category !== 'all' && category !== '') ||
    price !== 'all' ||
    rating !== 'all';

  return (
    <div className="flex-between my-4 flex-col md:flex-row">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {q !== 'all' && q !== '' && <FilterPill label="Query" value={q} />}
        {category !== 'all' && category !== '' && (
          <FilterPill label="Category" value={category} />
        )}
        {price !== 'all' && <FilterPill label="Price" value={price} />}
        {rating !== 'all' && (
          <FilterPill label="Rating" value={`${rating} stars & up`} />
        )}

        {hasActiveFilters && (
          <Button variant={'link'} asChild>
            <Link href="/search">Clear</Link>
          </Button>
        )}
      </div>

      <div>
        Sort by:{' '}
        {sortOrders.map((s) => (
          <Link
            key={s}
            className={`mx-2 ${sort == s && 'font-bold'}`}
            href={getFilterUrl({ s })}
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchHeader;
