import { Loader, LucideIcon } from 'lucide-react';

type LoadingIcon = {
  pending: boolean;
  Icon: LucideIcon;
};

const LoadingIcon = ({ pending, Icon }: LoadingIcon) =>
  pending ? (
    <Loader className="h-4 w-4 animate-spin" />
  ) : (
    <Icon className="h-4 w-4" />
  );

export default LoadingIcon;
