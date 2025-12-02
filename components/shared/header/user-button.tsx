'use client';
import { useState } from 'react';
import { UserIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteSessionCartCookie } from '@/lib/actions/user.actions';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

const UserButton = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === 'loading') return null;

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Delete the sessionCartId cookie
      await deleteSessionCartCookie();

      await signOut({ redirect: false });

      // Force refresh
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm leading-none font-medium">
                {session.user?.name}
              </div>
              <div className="text-muted-foreground text-sm leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuLabel>
            <Link href="/user/profile" className="w-full">
              User Profile
            </Link>
          </DropdownMenuLabel>

          <DropdownMenuLabel>
            <Link href="/user/orders" className="w-full">
              Order History
            </Link>
          </DropdownMenuLabel>

          <div className="w-full">
            <Button
              type="submit"
              className="h-4 w-full cursor-pointer justify-start px-2 py-4"
              variant="ghost"
              onClick={handleSignOut}
              disabled={loading}
            >
              Sign Out
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
