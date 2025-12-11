import { Button } from '@/components/ui/button';

type SubmitButtonProps = {
  isSubmitting: boolean;
  type: 'Create' | 'Update';
};

const SubmitButton = ({ isSubmitting, type }: SubmitButtonProps) => {
  return (
    <div>
      <Button
        type="submit"
        size="lg"
        className="col-span-2 w-full cursor-pointer"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting' : `${type} Product`}
      </Button>
    </div>
  );
};

export default SubmitButton;
