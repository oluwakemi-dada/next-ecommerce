import Pagination from '@/components/shared/pagination';
import OrdersTable from '../../../components/shared/order/orders-table';
import { getMyOrders } from '@/lib/actions/order.actions';

type OrdersPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { page } = await searchParams;
  const pageNumber = Number(page);

  const ordersResponse = await getMyOrders({
    page: pageNumber || 1,
  });

  const isInvalidPage =
    ordersResponse.totalPages > 0 && pageNumber > ordersResponse.totalPages;

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>

      {isInvalidPage ? (
        <div className="py-8 text-center">
          Page <strong>{pageNumber}</strong> not found.
          <br />
          Please select a valid page from the pagination below.
        </div>
      ) : (
        <OrdersTable orders={ordersResponse.data} />
      )}

      {ordersResponse.totalPages > 1 && (
        <Pagination
          page={pageNumber || 1}
          totalPages={ordersResponse?.totalPages}
        />
      )}
    </div>
  );
};

export default OrdersPage;
