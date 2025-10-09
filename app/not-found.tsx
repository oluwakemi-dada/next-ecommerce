'use client';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="w-1/3 rounded-lg p-6 text-center shadow-md">
        <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          variant="outline"
          className="mt-4 ml-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
