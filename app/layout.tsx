import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import CartInitializer from '@/components/shared/cart-initializer';
import { Toaster } from '@/components/ui/sonner';
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Prostore`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartInitializer />
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
