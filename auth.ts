import { compareSync } from 'bcrypt-ts-edge';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { authConfig } from './auth.config';
import { CartItem } from './types';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials === null) return null;

        // Find user in DB
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if the user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user does not exist or the password does not match, return null
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    session: async ({ session, user, trigger, token }: any) => {
      // Set the user ID from the token (jwt token)
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      return session;
    },
    jwt: async ({ token, user, trigger, session }: any) => {
      // Assign user fields to the token
      if (user) {
        token.sub = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email.split('@')[0];

          // Update database to reflect token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart && sessionCart.userId === null) {
              const sessionCartItems = (sessionCart.items as CartItem[]) || [];
              const hasItems = sessionCartItems.length > 0;

              if (hasItems) {
                // Delete current user cart
                await prisma.cart.deleteMany({
                  where: { userId: user.id },
                });

                // Assign new cart
                await prisma.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id },
                });
              } else {
                // Session cart is empty - check for existing user cart
                const existingUserCart = await prisma.cart.findFirst({
                  where: { userId: user.id },
                });

                if (existingUserCart) {
                  // User has existing cart - delete empty session cart
                  await prisma.cart.delete({
                    where: { id: sessionCart.id },
                  });
                } else {
                  // No existing cart - link the empty session cart
                  await prisma.cart.update({
                    where: { id: sessionCart.id },
                    data: { userId: user.id },
                  });
                }
              }
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },
  events: {
    async signOut({ token }: any) {
      const cookiesObject = await cookies();
      cookiesObject.delete('sessionCartId');
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
