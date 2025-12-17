import { getAllCategories } from '@/lib/actions/product.actions';
import Link from 'next/link';
import { GetFilterUrlProps } from './page';

type SearchFiltersProps = {
  category: string;
  price: string;
  rating: string;
  getFilterUrl: ({ c, p, r, s, pg }: GetFilterUrlProps) => string;
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $100',
    value: '51-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $500',
    value: '201-500',
  },
  {
    name: '$501 to $1000',
    value: '501-1000',
  },
];

const ratings = [4, 3, 2, 1];

const SearchFilters = async ({
  category,
  price,
  rating,
  getFilterUrl,
}: SearchFiltersProps) => {
  const categories = await getAllCategories();

  return (
    <div className="filter-links">
      {/* Category Links */}
      <div className="mt-3 mb-2 text-xl">Department</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${(category === 'all' || category === '') && 'font-bold'}`}
              href={getFilterUrl({ c: 'all' })}
            >
              Any
            </Link>
          </li>
          {categories.map((x) => (
            <li key={x.category}>
              <Link
                className={`${category === x.category && 'font-bold'}`}
                href={getFilterUrl({ c: x.category })}
              >
                {x.category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Links */}
      <div className="mt-8 mb-2 text-xl">Price</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${price === 'all' && 'font-bold'}`}
              href={getFilterUrl({ p: 'all' })}
            >
              Any
            </Link>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <Link
                className={`${price === p.value && 'font-bold'}`}
                href={getFilterUrl({ p: p.value })}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating Links */}
      <div className="mt-8 mb-2 text-xl">Customer Ratings</div>
      <div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${rating === 'all' && 'font-bold'}`}
              href={getFilterUrl({ r: 'all' })}
            >
              Any
            </Link>
          </li>
          {ratings.map((r) => (
            <li key={r}>
              <Link
                className={`${rating === r.toString() && 'font-bold'}`}
                href={getFilterUrl({ r: `${r}` })}
              >
                {`${r} stars & up`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
