import Head from 'next/head';
import { PublicLayout } from './PublicLayout';
import { AuthedLayout } from './AuthedLayout';
import { useSessionContext } from '@supabase/auth-helpers-react';

interface LayoutDeciderProps {
  children: React.ReactNode;
}

export const LayoutDecider: React.FC<LayoutDeciderProps> = ({ children }) => {
  const { session } = useSessionContext();

  return (
    <>
      <Head>
        <title>Just Another To-Do List</title>
        <meta name="description" content="Yeah, we know..." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      </Head>

      <div>{!session ? <PublicLayout>{children}</PublicLayout> : <AuthedLayout>{children}</AuthedLayout>}</div>
    </>
  );
};
