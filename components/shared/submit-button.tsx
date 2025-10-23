'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

type SubmitButton = {
  children: ReactNode;
  pendingLabel: string;
};

const SubmitButton = ({ children, pendingLabel }: SubmitButton) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="w-full cursor-pointer"
      variant="default"
    >
      {pending ? pendingLabel : children}
    </Button>
  );
};

export default SubmitButton;
