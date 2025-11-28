import { Fragment } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  'User Login',
  'Shipping Address',
  'Payment Method',
  'Place Order',
];

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="flex-between mb-10 flex-col space-y-2 space-x-2 md:flex-row">
      {steps.map((step, index) => (
        <Fragment key={step}>
          <div
            className={cn(
              'w-56 rounded-full p-2 text-center text-sm',
              index === current ? 'bg-secondary' : '',
            )}
          >
            {step}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
