import { ShoppingCart, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';

const MenuItems = () => {
  return (
    <>
      <ModeToggle />
      <Button asChild variant="ghost">
        <Link href="/cart">
          <ShoppingCart /> Cart
        </Link>
      </Button>
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    </>
  );
};

export default MenuItems;
