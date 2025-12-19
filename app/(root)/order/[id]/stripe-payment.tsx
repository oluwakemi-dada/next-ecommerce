'use client';
import { type FormEvent, useState } from 'react';
import { useTheme } from 'next-themes';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

type StripeFormProps = {
  orderId: string;
  priceInCents: number;
};

type StripePaymentProps = StripeFormProps & {
  clientSecret: string | null;
};

// Stripe Form Component
const StripeForm = ({ orderId, priceInCents }: StripeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (
          error?.type === 'card_error' ||
          error?.type === 'validation_error'
        ) {
          setErrorMessage(error?.message ?? 'An unknown error occurred');
        } else if (error) {
          setErrorMessage('An unknown error occurred');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className="w-full cursor-pointer"
        size="lg"
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading
          ? 'Purchasing...'
          : `Purchase ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
};

const StripePayment = ({
  orderId,
  priceInCents,
  clientSecret,
}: StripePaymentProps) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  );

  const { theme, systemTheme } = useTheme();

  return (
    <Elements
      options={{
        clientSecret: clientSecret!,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
                ? 'stripe'
                : systemTheme === 'light'
                  ? 'stripe'
                  : 'night',
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm orderId={orderId} priceInCents={priceInCents} />
    </Elements>
  );
};

export default StripePayment;
