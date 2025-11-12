import { Loader } from 'lucide-react';

const IconOrLoader = ({ pending, Icon }: { pending: boolean; Icon: any }) =>
  pending ? (
    <Loader className="h-4 w-4 animate-spin" />
  ) : (
    <Icon className="h-4 w-4" />
  );

export default IconOrLoader;
