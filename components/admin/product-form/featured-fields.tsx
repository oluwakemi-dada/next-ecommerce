import { toast } from 'sonner';
import { Control, Controller, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { UploadButton } from '@/lib/uploadthing';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ImagesFieldProps = {
  control: Control<any>;
  form: UseFormReturn<any>;
};

const FeaturedFields = ({ control, form }: ImagesFieldProps) => {
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <div className="upload-field">
      <div className="mb-2 text-sm font-medium">Featured Product</div>
      <Card className="py-3">
        <CardContent className="mt-2 space-y-2">
          <FieldGroup>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  className="items-center space-x-2 -mb-3"
                >
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="cursor-pointer"
                  />
                  <Label>Is Featured?</Label>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>

            {isFeatured && banner && (
              <Image
                src={banner}
                alt="banner image"
                className="w-full rounded-sm object-cover object-center"
                width={1920}
                height={680}
              />
            )}

            {isFeatured && !banner && (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  form.setValue('banner', res[0].url);
                }}
                onUploadError={(error: Error) => {
                  toast.error(`ERROR! ${error.message}`);
                }}
              />
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedFields;
