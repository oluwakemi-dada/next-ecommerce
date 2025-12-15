import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ActiveFilter from '@/components/admin/active-filter';

type ProductsHeaderProps = {
  searchText: string;
};

const ProductsHeader = ({ searchText }: ProductsHeaderProps) => {
  return (
    <div className="flex-between">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Products</h1>
        <ActiveFilter searchText={searchText} />
      </div>
      <Button asChild variant="default">
        <Link href="/admin/products/create">Create Product</Link>
      </Button>
    </div>
  );
};

export default ProductsHeader;
