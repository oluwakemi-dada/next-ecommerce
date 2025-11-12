import { compareSync } from 'bcrypt-ts-edge';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { authConfig } from './auth.config';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
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

      // If there is an update (user can update their name on profile page), set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    jwt: async ({ token, user, trigger, session }: any) => {
      // Assign user fields to the token
      if (user) {
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
      }

      return token;
    },
    // authorized: async ({ request, auth }: any) => {
    //   // Check for session cart id cookie
    //   if (!request.cookies.get('sessionCartId')) {
    //     // Generate new session cart id cookie
    //     const sessionCartId = crypto.randomUUID();

    //     // Clone req headers
    //     const newRequestHeaders = new Headers(request.headers);

    //     // Create new response and add the new headers
    //     const response = NextResponse.next({
    //       request: {
    //         headers: newRequestHeaders,
    //       },
    //     });

    //     // Set newly generated sessionCartId in the response cookies
    //     response.cookies.set('sessionCartId', sessionCartId);

    //     return response;
    //   }

    //   return true;
    // },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
