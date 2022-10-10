import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { LayoutDecider } from '../layouts/LayoutDecider';

const JustAnotherToDoList = ({ Component, pageProps }: AppProps) => {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <ThemeProvider>
        <LayoutDecider>
          <Component {...pageProps} />
        </LayoutDecider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default JustAnotherToDoList;
