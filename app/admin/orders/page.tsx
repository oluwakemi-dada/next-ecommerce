import { Metadata } from 'next';
import Pagination from '@/components/shared/pagination';
import OrdersTable from '@/components/shared/order/orders-table';
import ActiveFilter from '@/components/admin/active-filter';
import { getAllOrders } from '@/lib/actions/order.actions';
import { requireAdmin } from '@/lib/auth-guard';

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

  const { page = 1 , query: searchText} = await searchParams;
  const pageNumber = Number(page) || 1;


  const ordersResponse = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  const isInvalidPage =
    ordersResponse.totalPages > 0 && pageNumber > ordersResponse.totalPages;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Orders</h1>
        <ActiveFilter searchText={searchText} />
      </div>
      <div className="overflow-x-auto">
        {isInvalidPage ? (
          <div className="py-8 text-center">
            Page <strong>{pageNumber}</strong> not found.
            <br />
            Please select a valid page from the pagination below.
          </div>
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
