import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';
import CartInitializer from '@/components/shared/cart-initializer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <CartInitializer />
      <div className="flex h-screen flex-col">
        <Header />
        <main className="wrapper flex-1">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
