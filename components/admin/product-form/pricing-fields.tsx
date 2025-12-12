import { Controller, Control } from 'react-hook-form';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { parseNumberInput } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
type PricingFieldsProps = {
  control: Control<any>;
  hasVariants: boolean;
};

const PricingFields = ({ control, hasVariants }: PricingFieldsProps) => {
  return (
    <FieldGroup>
      <div className="flex flex-col gap-5 md:flex-row">
        {/* Price */}
        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="price-input">Price</Label>
              <Input
                {...field}
                id="price-input"
                placeholder="Enter product price"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Stock */}
        <Controller
          name="stock"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="stock-input">Stock</Label>
              <Input
                {...field}
                id="stock-input"
                placeholder="0"
                value={field.value ?? ''}
                onChange={(e) => {
                  const parsed = parseNumberInput(e.target.value);
                  field.onChange(parsed);
                }}
                aria-invalid={fieldState.invalid}
                disabled={hasVariants}
                aria-disabled={hasVariants}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
};

export default PricingFields;
