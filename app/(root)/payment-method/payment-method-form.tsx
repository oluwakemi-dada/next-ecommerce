'use client';
import { useTransition } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { ArrowRight } from 'lucide-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import LoadingIcon from '@/components/shared/loading-icon';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { paymentMethodSchema } from '@/lib/validators';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';

type PaymentMethodFormProps = {
  preferredPaymentMethod: string | null;
};

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: PaymentMethodFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (
    values: z.infer<typeof paymentMethodSchema>,
  ) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/place-order');
    });
  };

  return (
    <>
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-muted-foreground text-sm">
          Please select a payment method
        </p>

        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-3">
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="flex flex-col space-y-2"
                  >
                    {PAYMENT_METHODS.map((paymentMethod) => (
                      <Field
                        orientation="horizontal"
                        key={paymentMethod}
                        className="flex items-center space-y-0 space-x-3"
                      >
                        <RadioGroupItem
                          id={`${paymentMethod}-input`}
                          value={paymentMethod}
                          checked={field.value === paymentMethod}
                          className="cursor-pointer"
                        ></RadioGroupItem>
                        <FieldLabel
                          htmlFor={`${paymentMethod}-input`}
                          className="cursor-pointer font-normal"
                        >
                          {paymentMethod}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
              className="cursor-pointer"
            >
              <LoadingIcon pending={isPending} Icon={ArrowRight} /> Continue
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
