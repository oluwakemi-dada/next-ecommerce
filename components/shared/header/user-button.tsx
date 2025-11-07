'use client';
import { UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserButton = () => {
  const { data: session } = useSession();

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

          <form action={signOutUser} className="w-full">
            <Button
              type="submit"
              className="h-4 w-full cursor-pointer justify-start px-2 py-4"
              variant="ghost"
            >
              Sign Out
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
