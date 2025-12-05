import type { NextAuthConfig, Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';

export const authConfig = {
  providers: [],
  callbacks: {
    authorized: async ({
      request,
      auth,
    }: {
      request: NextRequest;
      auth: Session | null;
    }) => {
      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      // Array of regex patterns of protected paths that use callbacks
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
      ];

      // Admin paths - NO callback (redirect straight to unauthorized)
      const adminPaths = /\/admin/;

      // Auth pages that signed-in users shouldn't access
      const authPages = ['/sign-in', '/sign-up'];

      let userRole = auth?.user?.role;

      if (!userRole && auth) {
        const tokenValue =
          request.cookies.get('authjs.session-token')?.value ||
          request.cookies.get('__Secure-authjs.session-token')?.value;

        if (tokenValue) {
          try {
            // Determine salt based on which cookie was found
            const salt = request.cookies.get('authjs.session-token')
              ? 'authjs.session-token'
              : '__Secure-authjs.session-token';

            const token = await decode({
              token: tokenValue,
              secret: process.env.NEXTAUTH_SECRET!,
              salt,
            });

            userRole = token?.role as string | undefined;
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        }
      }

      // Redirect signed-in users away from auth pages
      if (auth && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Handle admin routes
      if (adminPaths.test(pathname)) {
        if (!auth) {
          // Redirect to sign-in without callback
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        if (userRole !== 'admin') {
          // Redirect to unauthorized
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }

      // Handle regular protected paths with callback
      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        // Redirect to sign-in with callback
        return NextResponse.redirect(
          new URL(
            `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
            request.url,
          ),
        );
      }

      // -----------------------------------------------------------------
      // -----------------------------------------------------------------

      // Add session cart cookie if needed
      const response = NextResponse.next();

      // Check for session cart id cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set('sessionCartId', sessionCartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
      }

      return response;
    },
  },
} satisfies NextAuthConfig;
