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
import { ToastContainer, TypeOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastClasses } from '../common/toast-classes';
import nextI18NextConfig from '../next-i18next.config.js';
import { appWithTranslation } from 'next-i18next';
import { TagService } from '../services/tag.service';
import { Tag } from '../common/models/tag';
import { TagContext } from '../common/contexts/tag.context';

const JustAnotherToDoList = ({ Component, pageProps }: AppProps) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const todoService = new TodoService();
  const tagService = new TagService();
  const [todoFilter, setTodoFilter] = useState<(todo: Todo) => boolean>(() => (todo: Todo) => true);
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const serviceContextProps = { todoService, tagService };
  const todoContextProps = { todos, setTodos, todoFilter, setTodoFilter, filterActive, setFilterActive };
  const tagContextProps = { tags, setTags };
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ThemeProvider>
        <ServiceContext.Provider value={serviceContextProps}>
          <TodoContext.Provider value={todoContextProps}>
            <TagContext.Provider value={tagContextProps}>
              <LayoutDecider>
                <Component {...pageProps} />
                <ToastContainer
                  position="bottom-left"
                  closeButton={false}
                  toastClassName={(context?: {
                    type?: TypeOptions;
                    defaultClassName?: string;
                    position?: ToastPosition;
                    rtl?: boolean;
                  }) => toastClasses[context?.type || 'default']}
                  hideProgressBar={true}
                />
              </LayoutDecider>
            </TagContext.Provider>
          </TodoContext.Provider>
        </ServiceContext.Provider>
      </ThemeProvider>
    </SessionContextProvider>
  );
};

export default appWithTranslation(JustAnotherToDoList, nextI18NextConfig);
