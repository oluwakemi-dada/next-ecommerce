import { Metadata } from 'next';
import Pagination from '@/components/shared/pagination';
import OrdersTable from '@/components/shared/order/orders-table';
import { getAllOrders } from '@/lib/actions/order.actions';
import { requireAdmin } from '@/lib/auth-guard';
import TableHeader from '@/components/admin/table-header';
import InvalidPage from '@/components/admin/invalid-page';

type AdminOrdersPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Admin Orders',
};

const AdminOrdersPage = async ({ searchParams }: AdminOrdersPageProps) => {
  await requireAdmin();

  const { page = 1, query: searchText } = await searchParams;
  const pageNumber = Number(page) || 1;

  const ordersResponse = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  const isInvalidPage =
    ordersResponse.totalPages > 0 && pageNumber > ordersResponse.totalPages;

  return (
    <div className="space-y-2">
      <TableHeader title="Orders" searchText={searchText} />
      <div className="overflow-x-auto">
        {isInvalidPage ? (
          <InvalidPage pageNumber={pageNumber} />
        ) : (
          <OrdersTable
            orders={ordersResponse.data}
            showEmptyMessage={false}
            showUser
            showAction
          />
        )}

        {ordersResponse.totalPages > 1 && (
          <Pagination
            currentPage={pageNumber}
            totalPages={ordersResponse?.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
