'use client';
import ErrorCard from '@/components/shared/error-card';
import { Button } from '@/components/ui/button';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  return (
    <ErrorCard>
      <h1 className="mb-4 text-3xl font-bold">Something went wrong!</h1>
      <p className="text-destructive">{error.message}</p>

      <Button
        variant="outline"
        className="mt-4 ml-2 cursor-pointer"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </ErrorCard>
  );
};

export default Error;
