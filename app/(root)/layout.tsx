import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function RootSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <SessionProvider>
        <Header />
        <main className="wrapper flex-1">{children}</main>
        <Footer />
      </SessionProvider>
    </div>
  );
}
