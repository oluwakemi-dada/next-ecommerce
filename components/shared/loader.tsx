import { BeatLoader } from 'react-spinners';

type LoaderProps = {
  fullScreen?: boolean;
};

const Loader = ({ fullScreen = false }: LoaderProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: `${fullScreen ? '100vh' : '100%'}`,
        width: `${fullScreen ? '100vw' : '100%'}`,
      }}
    >
      <BeatLoader color="currentColor" />
    </div>
  );
};

export default Loader;
