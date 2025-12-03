'use client';
import { HTMLAttributes } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type MainNavLinks = {
  title: string;
  href: string;
};

type MainNavProps = HTMLAttributes<HTMLElement> & {
  links: MainNavLinks[];
};

const MainNav = ({ links, className, ...props }: MainNavProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'hover:text-primary text-sm font-medium transition-colors',
            !pathname.includes(item.href) && 'text-muted-foreground',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
