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

      // Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Auth pages that signed-in users shouldn't access
      const authPages = ['/sign-in', '/sign-up'];

      let userRole = auth?.user?.role;
      if (!userRole && auth) {
        const tokenValue =
          request.cookies.get('authjs.session-token')?.value ||
          request.cookies.get('__Secure-authjs.session-token')?.value;

        console.log('tokenValue', tokenValue);

        if (tokenValue) {
          try {
            const token = await decode({
              token: tokenValue,
              secret: process.env.NEXTAUTH_SECRET!,
              salt: 'authjs.session-token',
            });

            console.log('decodedToken', token);

            userRole = token?.role as string | undefined;
            console.log('userRole', userRole);
            
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        }
      }

      // Redirect signed-in users away from auth pages
      if (auth && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Redirect unauthenticated users from protected paths
      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        // Redirect to sign-in with callback
        return NextResponse.redirect(
          new URL(
            `/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
            request.url,
          ),
        );
      }

      // Protect admin routes
      if (auth && pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
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
