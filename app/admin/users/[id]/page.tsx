import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import UpdateUserForm from './update-user-form';
import { requireAdmin } from '@/lib/auth-guard';

type AdminUserUpdatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Update User',
};

const AdminUserUpdatePage = async ({ params }: AdminUserUpdatePageProps) => {
  await requireAdmin();

  const { id } = await params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUserUpdatePage;
