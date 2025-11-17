'use client';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { shippingAddressSchema } from '@/lib/validators';
import { shippingAddress } from '@/types';
import { shippingAddressDefaultValues } from '@/lib/constants';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingIcon from '@/components/shared/loading-icon';
import { ArrowRight } from 'lucide-react';

type ShippingAddressFormProps = {
  address: shippingAddress;
};

const ShippingAddressForm = ({ address }: ShippingAddressFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof shippingAddressSchema>) => {
    console.log(values);
  };

  return (
    <>
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-muted-foreground text-sm">
          Please enter an address to ship to
        </p>

        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <div className="flex flex-col gap-5 md:flex-row">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <FieldLabel htmlFor="fullname-input">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="fullname-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter full name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <Controller
                name="streetAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <FieldLabel htmlFor="street-address-input">
                      Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="street-address-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter address"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <FieldLabel htmlFor="city-input">City</FieldLabel>
                    <Input
                      {...field}
                      id="city-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter city"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <FieldLabel htmlFor="postal-code-input">
                      Postal code
                    </FieldLabel>
                    <Input
                      {...field}
                      id="postal-code-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter postal code"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-full">
                    <FieldLabel htmlFor="country-input">Country</FieldLabel>
                    <Input
                      {...field}
                      id="country-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter country"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
          </FieldGroup>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
              className="cursor-pointer"
            >
              <LoadingIcon pending={isPending} Icon={ArrowRight} />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
