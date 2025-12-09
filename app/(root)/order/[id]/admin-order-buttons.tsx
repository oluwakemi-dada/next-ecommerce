'use client';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  updateOrderToPaidCOD,
  deliverOrder,
} from '@/lib/actions/order.actions';

type OrderButtonsProps = {
  order: { id: string };
};

export const MarkAsPaidButton = ({ order }: OrderButtonsProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      aria-disabled={isPending}
      className="cursor-pointer"
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidCOD(order.id);
          if (!res.success) {
            toast.error(res.message);
          } else {
            toast.success(res.message);
          }
        })
      }
    >
      {isPending ? 'processing...' : 'Mark As Paid'}
    </Button>
  );
};

export const MarkAsDeliveredButton = ({ order }: OrderButtonsProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      aria-disabled={isPending}
      className="cursor-pointer"
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(order.id);
          if (!res.success) {
            toast.error(res.message);
          } else {
            toast.success(res.message);
          }
        })
      }
    >
      {isPending ? 'processing...' : 'Mark As Delivered'}
    </Button>
  );
};
