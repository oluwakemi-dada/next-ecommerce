'use server';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn, signOut } from '@/auth';
import { signInFormSchema } from '../validators';

// Sign in the user with credentials
export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return {
      success: true,
      message: 'Signed in successfully',
      email: ''
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: 'Invalid email or password',
      email: formData.get('email') as string ?? '',
    };
  }
};

// Sign user out
export const signOutUser = async () => {
  await signOut();
};
