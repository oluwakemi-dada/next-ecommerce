import { Metadata } from 'next';
import Pagination from '@/components/shared/pagination';
import { getAllUsers } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';
import UsersTable from './users-table';
import TableHeader from '@/components/admin/table-header';
import InvalidPage from '@/components/admin/invalid-page';

type AdminUserPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Admin Users',
};

const AdminUsersPage = async (props: AdminUserPageProps) => {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';

  const users = await getAllUsers({ page: pageNumber, query: searchText });

  const isInvalidPage = users.totalPages > 0 && pageNumber > users.totalPages;

  return (
    <div className="space-y-2">
      <TableHeader title="Users" searchText={searchText} />

      <div className="overflow-x-auto">
        {isInvalidPage ? (
          <InvalidPage pageNumber={pageNumber} />
        ) : (
          <UsersTable users={users} />
        )}

        {users.totalPages > 1 && (
          <Pagination currentPage={pageNumber} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
