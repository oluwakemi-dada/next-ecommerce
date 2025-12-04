'use client';
import { toast } from 'sonner';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validators';

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values);

    if (!res.success) {
      toast.error(res.message);
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(newSession);

    toast.success(res.message);
  };

  return (
    <form
      method="post"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <FieldGroup>
        <div className="flex flex-col gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Field className="w-full">
                <Input
                  {...field}
                  disabled
                  aria-disabled="true"
                  placeholder="Email"
                  className="input-field"
                />
              </Field>
            )}
          ></Controller>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <Input
                  {...field}
                  placeholder="Name"
                  className="input-field"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
        </div>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="button col-span-2 w-full cursor-pointer"
        disabled={form.formState.isSubmitting}
        aria-disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
      </Button>
    </form>
  );
};

export default ProfileForm;
