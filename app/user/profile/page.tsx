import { Metadata } from 'next';
import ProfileForm from './profile-form';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

const ProfilePage = async () => {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
