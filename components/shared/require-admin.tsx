import { auth } from '@/auth';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';
import Header from './header';

type RequireAdminProps = {
  children: ReactNode;
};

const RequireAdmin = async ({ children }: RequireAdminProps) => {
  const session = await auth();

  if (session?.user?.role !== 'admin') {
    return (
      <>
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4 p-4">
          <h1 className="h1-bold text-4xl">Unauthorized Access </h1>

          <p className="text-muted-foreground text-center">
            You do not have permission to access this page.
          </p>

          <div className="flex gap-2">
            <Button asChild className="mt-4 ml-2 cursor-pointer">
              <Link href="/">Go Home</Link>
            </Button>

            {!session && (
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
