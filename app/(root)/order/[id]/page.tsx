import { Suspense } from 'react';
import { Metadata } from 'next';
import Loader from '@/components/shared/loader';
import { formatId } from '@/lib/utils';
import OrderDetailsView from './order-details-view';

type OrderDetailsPage = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async ({ params }: OrderDetailsPage) => {
  const { id } = await params;

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <Suspense fallback={<Loader />}>
        <OrderDetailsView id={id} />
      </Suspense>
    </>
  );
};

export default OrderDetailsPage;
