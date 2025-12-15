import Link from 'next/link';
import { Button } from '../ui/button';

type ActiveFilterProps = {
  searchText: string;
};

const ActiveFilter = ({ searchText }: ActiveFilterProps) => {
  if (!searchText) return null;
  
  return (
    <div>
      Filtered by <i>&quot;{searchText}&quot;</i>{' '}
      <Link href="/admin/products">
        <Button variant="outline" size="sm" className="ml-3 cursor-pointer">
          Remove Filter
        </Button>
      </Link>
    </div>
  );
};

export default ActiveFilter;
