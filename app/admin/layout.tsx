import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import AdminHeader from './admin-header';
import RequireAdmin from '@/components/shared/require-admin';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <RequireAdmin>
        <div className="flex flex-col">
          <AdminHeader />

          <div className="container mx-auto flex-1 space-y-4 p-8 pt-6">
            {children}
          </div>
        </div>
      </RequireAdmin>
    </SessionProvider>
  );
}
