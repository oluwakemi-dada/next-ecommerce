import { Control, Controller, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { Field, FieldError, FieldGroup } from '../../ui/field';
import { Label } from '../../ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadthing';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ImagesFieldProps = {
  control: Control<any>;
  form: UseFormReturn<any>;
};

const ImagesField = ({ form, control }: ImagesFieldProps) => {
  return (
    <FieldGroup>
      <Controller
        name="images"
        control={control}
        render={({ fieldState }) => {
          const images = form.watch('images');

          return (
            <Field className="w-full">
              <Label>Images</Label>
              <Card className="py-0">
                <CardContent className="mt-2 min-h-48 space-y-2">
                  <div className="flex-start space-x-2">
                    {images.map((image: string) => (
                      <Image
                        key={image}
                        src={image}
                        alt="product image"
                        className="h-20 w-20 rounded-sm object-cover object-center"
                        width={100}
                        height={100}
                      />
                    ))}

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue('images', [...images, res[0].url]);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </FieldGroup>
  );
};

export default ImagesField;
