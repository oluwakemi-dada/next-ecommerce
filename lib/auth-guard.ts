import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const requireAdmin = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return session;
};
