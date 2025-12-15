'use client';
import z from 'zod';
import { toast } from 'sonner';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { updateUserSchema } from '@/lib/validators';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USER_ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/actions/user.actions';

type UpdateUserFormProps = {
  user: z.infer<typeof updateUserSchema>;
};

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

      if (!res.success) {
        return toast.error(res.message);
      }

      toast.success(res.message);

      form.reset();

      router.push('/admin/users');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Email */}
        <div>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <FieldLabel htmlFor="email-input">Email</FieldLabel>
                <Input
                  {...field}
                  id="email-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter user email"
                  disabled={true}
                  aria-disabled={true}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
        </div>

        {/* Name */}
        <div>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <FieldLabel htmlFor="name-input">Name</FieldLabel>
                <Input
                  {...field}
                  id="name-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter user name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
        </div>

        {/* Role */}
        <div>
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldLabel htmlFor="role-input">Role</FieldLabel>
                <Select
                  value={field.value.toString()}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
        </div>
      </FieldGroup>
      <div className="flex-between mt-6">
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={form.formState.isSubmitting}
          aria-disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
