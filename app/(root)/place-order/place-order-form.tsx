'use client';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/shared/submit-button';
import { createOrder } from '@/lib/actions/order.actions';

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <SubmitButton
        pendingLabel={
          <>
            <Loader className="h-4 w-4 animate-spin" /> Place Order
          </>
        }
      >
        <>
          <Check className="h-4 w-4" /> Place Order
        </>
      </SubmitButton>
    </form>
  );
};

export default PlaceOrderForm;
