import {
  Bars3BottomLeftIcon,
  Bars3Icon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { KeyboardEvent, useEffect, useState } from 'react';
import { OptionMenu } from '../common/components/OptionMenu';
import { TodoDisclosure } from '../common/components/TodoDisclosure';
import { OptionMenuItem } from '../common/models/option-menu-item';
import { Todo } from '../common/models/todo';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';

const defaultTodos: Todo[] = [
  {
    id: '1',
    createdAt: new Date(),
    task: 'Pasar a buscar ropa',
    description: 'Pasar a buscar los 3 lavados que deje el jueves',
    status: { id: '1', name: 'Todo' },
  },
  {
    id: '2',
    createdAt: new Date(),
    task: 'Pasar a buscar recetas',
    status: { id: '1', name: 'Todo' },
  },
  {
    id: '3',
    createdAt: new Date(),
    task: 'Comprar medidor',
    status: { id: '2', name: 'Completed' },
  },
  {
    id: '4',
    createdAt: new Date(),
    task: 'Armar Compu',
    status: { id: '1', name: 'Todo' },
  },
  {
    id: '5',
    createdAt: new Date(),
    task: 'Test',
    status: { id: '3', name: 'Deleted' },
  },
];

const Home: NextPage = () => {
  const router = useRouter();
  const [homeMenuOptions, setHomeMenuOptions] = useState<OptionMenuItem[]>([]);
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [newTodoString, setNewTodoString] = useState<string>('');
  const user = useUser();
  const addNewTodo = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newTodo: Todo = {
        id: `${todos.length}`,
        task: newTodoString,
        createdAt: new Date(),
        status: { id: '1', name: 'todo' },
      };
      setTodos((current) => [newTodo, ...current]);
      setNewTodoString('');
    } else if (event.key === 'Escape') {
      setNewTodoString('');
    }
  };

  const deleteTodo = (todo?: Todo) => {
    if (Object.entries(todo || {})?.length > 0) {
      setTodos((current) => current.filter((todoFromList) => todoFromList?.id !== todo?.id));
    }
  };

  useEffect(() => {
    setHomeMenuOptions((current) =>
      current.map((option: OptionMenuItem) => {
        if (option.label.toLowerCase().includes('completed')) {
          const newOption = {
            ...option,
            label: showCompleted ? 'Hide completed' : 'Show completed',
            icon: showCompleted ? EyeSlashIcon : EyeIcon,
          };
          return newOption;
        }
        return option;
      })
    );
  }, [showCompleted]);

  useEffect(() => {
    setHomeMenuOptions((current) =>
      current.map((option: OptionMenuItem) => {
        if (option.label.toLowerCase().includes('details')) {
          const newOption = {
            ...option,
            label: showDescription ? 'Hide Details' : 'Show Details',
            icon: showDescription ? Bars3Icon : Bars3BottomLeftIcon,
          };
          return newOption;
        }
        return option;
      })
    );
  }, [showDescription]);

  const getTodo = async () => {
    const a = await fetch(`/api/todos/${user?.id}/todo/1i01m1039cn139nc193nc9`);
    console.log(JSON.stringify(a))
  };
  useEffect(() => {
    if (router.isReady) {
      const homeMenuOptionsDefault: OptionMenuItem[] = [
        {
          label: 'Hide completed',
          action: (item: OptionMenuItem) => {
            setShowCompleted((current) => !current);
          },
          className: '',
          icon: EyeSlashIcon,
        },
        {
          label: 'Show Details',
          action: (item: OptionMenuItem) => {
            setShowDescription((current) => !current);
          },
          className: '',
          icon: Bars3BottomLeftIcon,
        },
      ];
      setHomeMenuOptions(homeMenuOptionsDefault);
      getTodo();
    }
  }, [router.isReady]);
  return (
    <div className="flex h-screen w-full flex-row items-start justify-center py-2">
      <div
        className={classNames('w-1/2 min-h-screen h-full flex flex-col space-y-3 p-4 transition-all duration-300', {
          'border-r border-th-accent-medium mt-0': selectedTodo,
          'mt-6': !selectedTodo,
        })}
      >
        <div className="w-full flex flex-row items-center justify-between">
          <h1 className="text-2xl text-th-primary-dark">Home</h1>
          <OptionMenu options={homeMenuOptions} />
        </div>
        <div className="w-full flex flex-row items-center justify-between">
          <input
            placeholder="New Task..."
            onKeyDown={(e) => addNewTodo(e)}
            onChange={(e) => setNewTodoString(e.target.value)}
            value={newTodoString}
            className="rounded-md text-base w-full px-3 py-2 focus:ring-th-accent-medium focus:ring-1 focus:outline-none placeholder:text-th-primary-dark placeholder:opacity-30 text-th-primary-medium border border-th-accent-medium bg-th-background"
          />
        </div>
        <div className="flex flex-col w-full items-start justify-start">
          <TodoDisclosure
            title="Todos"
            todos={todos.filter((todoFromList) => todoFromList.status?.name?.toLowerCase() === 'todo')}
            showDescription={showDescription}
            setSelectedTodo={(todo: Todo) => setSelectedTodo(todo)}
            onDelete={(todo?: Todo) => deleteTodo(todo)}
            onChange={(todo: Todo, status: 'completed' | 'todo') => {
              setTodos((current: Todo[]) =>
                current.map((item: Todo) => {
                  if (item.id === todo.id) {
                    return {
                      ...item,
                      status: {
                        ...item?.status,
                        name: status,
                      },
                    };
                  }
                  return item;
                })
              );
            }}
          />
          {showCompleted && (
            <TodoDisclosure
              title="Completed"
              todos={todos.filter((todoFromList) => todoFromList.status?.name?.toLowerCase() === 'completed')}
              showDescription={showDescription}
              setSelectedTodo={(todo: Todo) => setSelectedTodo(todo)}
              onDelete={(todo?: Todo) => deleteTodo(todo)}
              onChange={(todo: Todo, status: 'completed' | 'todo') => {
                setTodos((current: Todo[]) =>
                  current.map((item: Todo) => {
                    if (item.id === todo.id) {
                      return {
                        ...item,
                        status: {
                          ...item?.status,
                          name: status,
                        },
                      };
                    }
                    return item;
                  })
                );
              }}
            />
          )}
        </div>
      </div>
      <div
        className={classNames(
          'relative min-h-screen transition-all duration-300 h-full mt-12 flex flex-col space-y-3 p-4',
          {
            'w-1/2 opacity-100': Object.entries(selectedTodo || {}).length > 0,
            'w-0 opacity-0': Object.entries(selectedTodo || {}).length === 0,
          }
        )}
      >
        <div
          className={classNames('absolute top-[40%] left-0 transition-all duration-300 z-50', {
            'opacity-100': Object.entries(selectedTodo || {}).length > 0,
            'opacity-0': Object.entries(selectedTodo || {}).length === 0,
          })}
        >
          <button
            onClick={() => setSelectedTodo(undefined)}
            className="flex flex-col items-center justify-center h-16 m-0 rounded-r-2xl pt-0.5 pb-1 pl-0.5 hover:bg-th-background-secondary"
          >
            <ChevronRightIcon className="h-6 w-6 text-th-accent-light" />
          </button>
        </div>
        <div className="w-full flex flex-row items-center justify-between pl-4">
          <input
            placeholder="Enter a task"
            minLength={1}
            maxLength={100}
            className="text-2xl text-ellipsis text-th-primary-dark outline-none focus:border-b-2 focus:border-th-accent-medium pb-1 w-[85%] bg-th-background placeholder:text-th-primary-dark placeholder:opacity-40"
            onChange={(e) => {
              setTodos((current) =>
                current.map((item) => {
                  if (item.id === selectedTodo?.id) {
                    return { ...item, task: e.target.value };
                  }
                  return item;
                })
              );
              setSelectedTodo((current) => ({ ...current, task: e.target.value }));
            }}
            value={selectedTodo?.task}
          />
          <div className="flex flex-row items-center justify-end gap-2">
            <button className="hover:bg-th-background-secondary rounded-full p-1 flex flex-col justify-center items-center">
              <EllipsisHorizontalIcon className="h-5 w-5 text-th-primary-medium" />
            </button>
            <button
              onClick={() => setSelectedTodo(undefined)}
              className="hover:bg-th-background-secondary rounded-full p-1 flex flex-col justify-center items-center"
            >
              <XMarkIcon className="h-5 w-5 text-th-primary-medium" />
            </button>
          </div>
        </div>

        <div className="w-full flex flex-row items-start justify-start px-4">
          <textarea
            onChange={(e) => {
              setTodos((current) =>
                current.map((item) => {
                  if (item.id === selectedTodo?.id) {
                    return { ...item, description: e.target.value };
                  }
                  return item;
                })
              );
              setSelectedTodo((current) => ({ ...current, description: e.target.value }));
            }}
            value={selectedTodo?.description || ''}
            placeholder="Task description"
            rows={30}
            className="bg-th-background p-0 w-full h-[90%] focus:border-transparent focus:ring-0 resize-none border-transparent outline-none text-sm text-th-primary-medium placeholder:text-th-primary-medium placeholder:opacity-40"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Home;
