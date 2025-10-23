import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import UserButton from './user-button';

const MenuItems = () => {
  return (
    <>
      <ModeToggle />
      <Button asChild variant="ghost">
        <Link href="/cart">
          <ShoppingCart /> Cart
        </Link>
      </Button>
      <UserButton />
    </>
  );
};

export default MenuItems;
