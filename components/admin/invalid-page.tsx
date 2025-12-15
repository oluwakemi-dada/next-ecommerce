import Link from 'next/link';

type InvalidPageProps = {
  pageNumber: number;
  href: string;
};

const InvalidPage = ({ pageNumber, href }: InvalidPageProps) => {
  return (
    <div className="py-8 text-center">
      Page <strong>{pageNumber}</strong> not found.
      <br />
      Please select a valid page from the pagination below or return to{' '}
      <Link href={href} className="text-muted-foreground">
        page 1
      </Link>
      .
    </div>
  );
};

export default InvalidPage;
