import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order.actions';
import { ShippingAddress } from '@/types';

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

  const order = await getOrderById(id);
  if (!order) notFound();

  return <>Details {order.totalPrice}</>;
};

export default OrderDetailsPage;
