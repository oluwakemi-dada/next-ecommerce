'use client';
import { toast } from 'sonner';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
} from '@/lib/actions/order.actions';

type PayPalPaymentProps = {
  order: {
    id: string
  };
  paypalClientId: string;
};

const PrintLoadingState = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  let status = '';

  if (isPending) {
    status = 'Loading PayPal...';
  } else if (isRejected) {
    status = 'Error Loading PayPal';
  }

  return status;
};

const PayPalPayment = ({ order, paypalClientId }: PayPalPaymentProps) => {
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message);
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  };

  return (
    <div>
      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
        <PrintLoadingState />

        <PayPalButtons
          createOrder={handleCreatePayPalOrder}
          onApprove={handleApprovePayPalOrder}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment;
