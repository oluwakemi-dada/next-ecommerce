import { Metadata } from 'next';
import { getAllOrders } from '@/lib/actions/order.actions';
import { requireAdmin } from '@/lib/auth-guard';

import Pagination from '@/components/shared/pagination';
import OrdersTable from '@/components/shared/order/orders-table';

type AdminOrdersPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Admin Orders',
};

const AdminOrdersPage = async ({ searchParams }: AdminOrdersPageProps) => {
  await requireAdmin();

  const { page = 1 } = await searchParams;
  const pageNumber = Number(page);

  const ordersResponse = await getAllOrders({
    page: Number(page),
  });

  const isInvalidPage =
    ordersResponse.totalPages > 0 && pageNumber > ordersResponse.totalPages;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Orders</h1>
        {/* {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{' '}
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )} */}
      </div>
      <div className="overflow-x-auto">
        {isInvalidPage ? (
          <div className="py-8 text-center">
            Page <strong>{pageNumber}</strong> not found.
            <br />
            Please select a valid page from the pagination below.
          </div>
        ) : (
          <OrdersTable orders={ordersResponse.data} showEmptyMessage={false} />
        )}

        {ordersResponse.totalPages > 1 && (
          <Pagination
            page={pageNumber || 1}
            totalPages={ordersResponse?.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
