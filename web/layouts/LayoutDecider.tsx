import Head from 'next/head';
import { User, useUser } from '@supabase/auth-helpers-react';
import { PublicLayout } from './PublicLayout';
import { AuthedLayout } from './AuthedLayout';
import { useEffect, useState } from 'react';

interface LayoutDeciderProps {
  children: React.ReactNode;
}

export const LayoutDecider: React.FC<LayoutDeciderProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    setUserData(user);
  }, [user]);
  return (
    <>
      <Head>
        <title>Just Another To-Do List</title>
        <meta name="description" content="Yeah, we know..." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      </Head>

      <div>
        {!isLoading && !userData ? (
          <PublicLayout>{children}</PublicLayout>
        ) : !isLoading ? (
          <AuthedLayout>{children}</AuthedLayout>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};
