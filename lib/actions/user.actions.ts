'use server';
import { ZodError } from 'zod';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { auth, signIn } from '@/auth';
import { prisma } from '@/db/prisma';
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from '../validators';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { cookies } from 'next/headers';

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
      email: '',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
        email: (formData.get('email') as string) ?? '',
      };
    }

    return {
      success: false,
      message: 'Invalid email or password',
      email: (formData.get('email') as string) ?? '',
    };
  }
};

// Sign up user
export const signUpUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return {
      success: true,
      message: 'User registered successfully',
      name: '',
      email: '',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
      name: (formData.get('name') as string) ?? '',
      email: (formData.get('email') as string) ?? '',
    };
  }
};

// Get user by the ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  return user;
};

export async function deleteSessionCartCookie() {
  const cookiesObject = await cookies();

  // Try explicit deletion with options
  cookiesObject.set('sessionCartId', '', {
    expires: new Date(0), // Set to past date
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Also try the delete method
  cookiesObject.delete('sessionCartId');
}

// Update the user's address
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
