import { X } from 'lucide-react';
import { Controller, Control } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldError } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSizesForCategory, parseNumberInput } from '@/lib/utils';

type VariantFormFieldsProps = {
  index: number;
  control: Control<any>;
  selectedCategory: string;
  onRemove: () => void;
};

export const VariantFormFields = ({
  index,
  control,
  selectedCategory,
  onRemove,
}: VariantFormFieldsProps) => {
  const availableSizes = getSizesForCategory(selectedCategory);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Variant {index + 1}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Color - Full Color Picker */}
        <Controller
          name={`variants.${index}.color`}
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor={`variant-${index}-color-input`}>Color</Label>
              <Popover>
                <div className="flex items-center gap-2">
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-12 shrink-0 p-1"
                    >
                      <div
                        className="h-full w-full rounded"
                        style={{
                          backgroundColor: field.value || '#e5e7eb',
                        }}
                      />
                    </Button>
                  </PopoverTrigger>
                  <Input
                    id={`variant-${index}-color-input`}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    placeholder="Select or enter hex color"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
                <PopoverContent className="w-auto p-3">
                  <HexColorPicker
                    color={field.value || '#000000'}
                    onChange={(color) => field.onChange(color)}
                  />
                  <div className="mt-3 border-t pt-3">
                    <p className="text-muted-foreground mb-1 text-xs">
                      Selected: {field.value || 'None'}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.onChange(null)}
                      className="w-full"
                    >
                      Clear Color
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Size - Dynamic Dropdown */}
        <Controller
          name={`variants.${index}.size`}
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor={`variant-${index}-size-select`}>Size</Label>
              {availableSizes.length > 0 ? (
                <Select
                  value={field.value ?? ''}
                  onValueChange={(value) => field.onChange(value || null)}
                >
                  <SelectTrigger
                    id={`variant-${index}-size-select`}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-muted-foreground py-2 text-sm">
                  Select a category first to see available sizes
                </div>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Stock */}
        <Controller
          name={`variants.${index}.stock`}
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor={`variant-${index}-stock-input`}>Stock *</Label>
              <Input
                {...field}
                id={`variant-${index}-stock-input`}
                type="number"
                placeholder="0"
                aria-invalid={fieldState.invalid}
                required
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(parseNumberInput(e.target.value))
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Price Override */}
        <Controller
          name={`variants.${index}.price`}
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor={`variant-${index}-price-input`}>
                Price Override
              </Label>
              <Input
                {...field}
                id={`variant-${index}-price-input`}
                type="number"
                step="0.01"
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? null : value);
                }}
                placeholder="Leave empty to use base price"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Image URL */}
      </div>

      {/* Is Active Checkbox */}
      <Controller
        name={`variants.${index}.isActive`}
        control={control}
        render={({ field }) => (
          <div className="flex flex-row items-start space-y-0 space-x-3">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            <div className="space-y-1 leading-none">
              <Label>Active</Label>
            </div>
          </div>
        )}
      />
    </div>
  );
};
