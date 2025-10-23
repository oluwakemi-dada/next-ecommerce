'use client';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';

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
