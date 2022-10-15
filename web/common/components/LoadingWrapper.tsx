import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from './Spinner';

interface LoadingWrapperProps {
  loading: boolean;
  children?: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children, loading }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      setShow(true);
    }
  }, [router.isReady]);

  return (
    <>
      {show && (
        <div>
          {loading ? (
            <div className="w-screen md:w-full min-h-screen flex flex-col items-center justify-center pb-32">
              <Spinner size="md" />
            </div>
          ) : (
            <>{children}</>
          )}
        </div>
      )}
    </>
  );
};
