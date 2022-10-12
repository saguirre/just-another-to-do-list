import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { LayoutDecider } from '../layouts/LayoutDecider';
import { useState } from 'react';

const JustAnotherToDoList = ({ Component, pageProps }: AppProps) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ThemeProvider>
        <LayoutDecider>
          <Component {...pageProps} />
        </LayoutDecider>
      </ThemeProvider>
    </SessionContextProvider>
  );
};

export default JustAnotherToDoList;
