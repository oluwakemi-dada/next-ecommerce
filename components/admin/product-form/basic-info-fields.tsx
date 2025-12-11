import { Control, Controller, UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup } from '../../ui/field';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { CATEGORY_OPTIONS } from '@/lib/constants';
import slugify from 'slugify';

type BasicInfoFieldsProps = {
  control: Control<any>;
  form: UseFormReturn<any>;
};

const BasicInfoFields = ({ control, form }: BasicInfoFieldsProps) => {
  return (
    <FieldGroup>
      <div className="flex flex-col gap-5 md:flex-row">
        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="name-input">Product Name</Label>
              <Input
                {...field}
                id="name-input"
                placeholder="Enter product name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Slug */}
        <Controller
          name="slug"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="slug-input">Slug</Label>
              <div className="relative">
                <Input
                  {...field}
                  id="slug-input"
                  placeholder="product-slug"
                  aria-invalid={fieldState.invalid}
                />
                <Button
                  type="button"
                  className="mt-2 cursor-pointer bg-gray-500 px-4 py-1 text-white hover:bg-gray-600"
                  onClick={() => {
                    form.setValue(
                      'slug',
                      slugify(form.getValues('name'), {
                        lower: true,
                      }),
                    );
                  }}
                >
                  Generate
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex flex-col gap-5 md:flex-row">
        {/* Category - Dropdown */}
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="category-select">Category</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="category-select"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Brand */}
        <Controller
          name="brand"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="brand-input">Brand</Label>
              <Input
                {...field}
                id="brand-input"
                placeholder="Enter brand"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
};

export default BasicInfoFields;
