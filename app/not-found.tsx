'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ErrorCard from '@/components/shared/error-card';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <ErrorCard>
      <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
      <p className="text-destructive">Could not find requested page</p>
      <Button
        variant="outline"
        className="mt-4 ml-2 cursor-pointer"
        onClick={() => router.push('/')}
      >
        Back To Home
      </Button>
    </ErrorCard>
  );
};

export default NotFoundPage;
