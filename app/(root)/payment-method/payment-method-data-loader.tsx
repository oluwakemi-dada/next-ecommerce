import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@/auth';
import PaymentMethodForm from './payment-method-form';

const PaymentMethodDataLoader = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  return <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />;
};

export default PaymentMethodDataLoader;
