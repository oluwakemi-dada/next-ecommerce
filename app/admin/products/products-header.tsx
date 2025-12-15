import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ProductsHeaderProps = {
  searchText: string;
};

const ProductsHeader = ({ searchText }: ProductsHeaderProps) => {
  return (
    <div className="flex-between">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Products</h1>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{' '}
            <Link href="/admin/products">
              <Button variant="outline" size="sm" className="cursor-pointer ml-3">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Button asChild variant="default">
        <Link href="/admin/products/create">Create Product</Link>
      </Button>
    </div>
  );
};

export default ProductsHeader;
