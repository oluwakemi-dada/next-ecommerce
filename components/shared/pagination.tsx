'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, formUrlQuery, generatePagination } from '@/lib/utils';
import { Button } from '../ui/button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  urlParamName?: string;
};

const createPageURL = (
  pageNumber: number | string,
  pathname: string,
  searchParams: URLSearchParams,
  urlParamName?: string,
) => {
  return formUrlQuery({
    params: searchParams.toString(),
    pathname,
    key: urlParamName || 'page',
    value: pageNumber.toString(),
  });
};

const PaginationNumber = ({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) => {
  const className = cn(
    'flex h-[40px] w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-foreground border-foreground text-background': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300 text-black pb-2': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  urlParamName,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = (btnType: string) => {
    const pageValue =
      btnType === 'next' ? Number(currentPage) + 1 : Number(currentPage) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      pathname,
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="mt-4 flex gap-3">
      <Button
        size="lg"
        variant="outline"
        className="w-25 cursor-pointer"
        disabled={Number(currentPage) <= 1}
        onClick={() => handleClick('prev')}
      >
        Previous
      </Button>

      {allPages.map((page, index) => {
        let position: 'first' | 'last' | 'single' | 'middle' | undefined;

        if (index === 0) position = 'first';
        if (index === allPages.length - 1) position = 'last';
        if (allPages.length === 1) position = 'single';
        if (page === '...') position = 'middle';

        const pageUrl = createPageURL(
          page,
          pathname,
          searchParams,
          urlParamName,
        );

        return (
          <PaginationNumber
            key={`${page}-${index}`}
            href={pageUrl}
            page={page}
            position={position}
            isActive={currentPage === page}
          />
        );
      })}

      <Button
        size="lg"
        variant="outline"
        className="w-25 cursor-pointer"
        disabled={Number(currentPage) >= totalPages}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
