import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { LayoutDecider } from '../layouts/LayoutDecider';
import { useState } from 'react';
import { TodoService } from '../services/todo.service';
import { ServiceContext } from '../common/contexts/service.context';
import { TodoContext } from '../common/contexts/todo.context';
import { Todo } from '../common/models/todo';

const JustAnotherToDoList = ({ Component, pageProps }: AppProps) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [todos, setTodos] = useState<Todo[]>([]);
  const todoService = new TodoService();

  const serviceContextProps = { todoService };
  const todoContextProps = { todos, setTodos };
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ThemeProvider>
        <ServiceContext.Provider value={serviceContextProps}>
          <TodoContext.Provider value={todoContextProps}>
            <LayoutDecider>
              <Component {...pageProps} />
            </LayoutDecider>
          </TodoContext.Provider>
        </ServiceContext.Provider>
      </ThemeProvider>
    </SessionContextProvider>
  );
};

export default JustAnotherToDoList;
