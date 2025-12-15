import Link from 'next/link';
import { Button } from '@/components/ui/button';

type UsersHeader = {
  searchText: string;
};

const UsersHeader = ({ searchText }: UsersHeader) => {
  return (
    <div className="flex items-center gap-3">
      <h1 className="h2-bold">Users</h1>
      {searchText && (
        <div>
          Filtered by <i>&quot;{searchText}&quot;</i>{' '}
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              Remove Filter
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UsersHeader;
