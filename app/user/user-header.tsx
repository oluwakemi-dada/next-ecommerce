import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import { APP_NAME } from '@/lib/constants';
import MainNav from '../../components/shared/header/main-nav';

const links = [
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Orders',
    href: '/user/orders',
  },
];

const UserHeader = () => {
  return (
    <div className="container mx-auto border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="w-22">
          <Image src="/images/logo.svg" height={48} width={48} alt={APP_NAME} />
        </Link>

        <MainNav links={links} className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
