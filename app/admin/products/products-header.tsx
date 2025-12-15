import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TableHeader from '@/components/admin/table-header';

type ProductsHeaderProps = {
  searchText: string;
};

const ProductsHeader = ({ searchText }: ProductsHeaderProps) => {
  return (
    <div className="flex-between">
      <TableHeader title="Products" searchText={searchText} />
      <Button asChild variant="default">
        <Link href="/admin/products/create">Create Product</Link>
      </Button>
    </div>
  );
};

export default ProductsHeader;
