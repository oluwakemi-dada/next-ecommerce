import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/footer';
import Header from '@/components/shared/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <main className="wrapper flex-1">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
