import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { ReactNode } from 'react';

type ErrorCardProps = { children: ReactNode };

const ErrorCard = ({ children }: ErrorCardProps) => {
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
        {children}
      </div>
    </div>
  );
};

export default ErrorCard;
