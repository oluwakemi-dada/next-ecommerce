import { Suspense } from 'react';
import Loader from '@/components/shared/loader';
import OrdersTable from './orders-table';

type OrdersPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { page } = await searchParams;

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <Suspense fallback={<Loader />}>
        <OrdersTable page={page} />
      </Suspense>
    </div>
  );
};

export default OrdersPage;
