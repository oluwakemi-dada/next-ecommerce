import { BeatLoader } from 'react-spinners';

const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <BeatLoader color="currentColor" />
    </div>
  );
};

export default LoadingPage;
