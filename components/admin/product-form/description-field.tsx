import { Control, Controller } from 'react-hook-form';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type DescriptionFieldProps = {
  control: Control<any>;
};

const DescriptionField = ({ control }: DescriptionFieldProps) => {
  return (
    <FieldGroup>
      <div>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="w-full">
              <Label htmlFor="description-input">Description</Label>
              <Textarea
                {...field}
                id="description-input"
                placeholder="Enter product description"
                className="resize-none"
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

export default DescriptionField;
