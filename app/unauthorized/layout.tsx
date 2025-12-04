import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Header from '@/components/shared/header';

export default async function UnauthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Header />
      {children}
    </SessionProvider>
  );
}
