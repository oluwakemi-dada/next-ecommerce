import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import { APP_NAME } from '@/lib/constants';
import MainNav from './main-nav';
import { auth } from '@/auth';

export default async function UserSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col">
        <div className="container mx-auto border-b">
          <div className="flex h-16 items-center px-4">
            <Link href="/" className="w-22">
              <Image
                src="/images/logo.svg"
                height={48}
                width={48}
                alt={APP_NAME}
              />
            </Link>

            <MainNav className="mx-6" />

            <div className="ml-auto flex items-center space-x-4">
              <Menu />
            </div>
          </div>
        </div>

        <div className="container mx-auto flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
