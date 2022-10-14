import {
  Bars3BottomLeftIcon,
  Bars3Icon,
  CheckIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { KeyboardEvent, useCallback, useContext, useEffect } from 'react';
import { OptionMenu } from '../common/components/OptionMenu';
import { TodoDisclosure } from '../common/components/TodoDisclosure';
import { OptionMenuItem } from '../common/models/option-menu-item';
import { Todo } from '../common/models/todo';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { status } from '@prisma/client';
import { TodoContext } from '../common/contexts/todo.context';
import { ServiceContext } from '../common/contexts/service.context';
import { Spinner } from '../common/components/Spinner';
import { debounce } from 'lodash';
import useState from 'react-usestateref';
import { TbTrashOff } from 'react-icons/tb';
import { OnboardingModal } from '../common/components/OnboardingModal';

const Home: NextPage = () => {
  const router = useRouter();
  const [homeMenuOptions, setHomeMenuOptions] = useState<OptionMenuItem[]>([]);
  const { todos, setTodos } = useContext(TodoContext);
  const { todoService } = useContext(ServiceContext);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo, selectedTodoRef] = useState<Todo>();
  const [newTodoString, setNewTodoString] = useState<string>('');
  const [todoBeingUpdated, setTodoBeingUpdated] = useState<Todo>();
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [autoSaving, setAutosaving] = useState<boolean>(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);
  const [autoSaved, setAutosaved] = useState<boolean>(true);

  const user = useUser();
  const debounceUpdateTodo = useCallback(
    debounce(async (todo: Todo) => {
      setAutosaving(true);
      const updatedTodo = await todoService?.updateTodoById({ ...todo }, todo?.id, user?.id);
      if (updatedTodo) {
        setAutosaving(false);
        setAutosaved(true);
      }
      setAutosaving(false);
    }, 500),
    []
  );

  const addNewTodo = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setLoadingAdd(true);
      const newTodo: Todo = {
        task: newTodoString,
        createdAt: new Date(),
        status: status.TODO,
      };
      const addedTodo = await todoService?.createTodo(newTodo, user?.id);
      if (addedTodo) {
        setTodos((current: Todo[]): Todo[] => [addedTodo, ...current]);
        setNewTodoString('');
      }
      setLoadingAdd(false);
    } else if (event.key === 'Escape') {
      setNewTodoString('');
    }
  };

  const updateTodo = async (todo: Todo, isSlash?: boolean) => {
    let todoToUpdate = todo;
    if (isSlash) {
      todoToUpdate = { ...todo, beingSlashed: true };
    }
    setTodoBeingUpdated(todoToUpdate);
    const updatedTodo = await todoService?.updateTodoById({ ...todo }, todo?.id, user?.id);
    if (updatedTodo) {
      setTodoBeingUpdated(undefined);
      setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    }
  };

  const deleteTodo = async (todo?: Todo) => {
    if (todo) {
      const todoToDelete = { ...todo, beingDeleted: true };
      setTodoBeingUpdated(todoToDelete);
      const deletedTodo = await todoService?.deleteTodoById(todo?.id, user?.id);
      if (deletedTodo) {
        setTodoBeingUpdated(undefined);
        if (deletedTodo?.id === selectedTodoRef.current?.id) {
          setSelectedTodo(undefined);
        }
        setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === deletedTodo.id ? deletedTodo : t)));
      }
    }
  };

  const reviveTodo = async (todo?: Todo) => {
    if (todo) {
      const todoToRevive = { ...todo, beingRevived: true };
      setTodoBeingUpdated(todoToRevive);
      const revivedTodo = await todoService?.updateTodoById({ ...todo, deleted: false }, todo?.id, user?.id);
      if (revivedTodo) {
        setTodoBeingUpdated(undefined);
        setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === revivedTodo.id ? revivedTodo : t)));
      }
    }
  };

  useEffect(() => {
    setHomeMenuOptions((current) =>
      current.map((option: OptionMenuItem) => {
        if (option.label.toLowerCase().includes('completed')) {
          const newOption = {
            ...option,
            label: showCompleted ? 'Hide Completed' : 'Show Completed',
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
        if (option.label.toLowerCase().includes('deleted')) {
          const newOption = {
            ...option,
            label: showDeleted ? 'Hide Deleted' : 'Show Deleted',
            icon: showDeleted ? TbTrashOff : TrashIcon,
          };
          return newOption;
        }
        return option;
      })
    );
  }, [showDeleted]);

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

  useEffect(() => {
    if (todoBeingUpdated) {
      if (todoBeingUpdated.beingAdded) {
        setTodos((current) =>
          current.map((todo) => {
            if (todo.id === todoBeingUpdated.id) {
              return { ...todo, beingAdded: true };
            }
            return todo;
          })
        );
      } else if (todoBeingUpdated.beingSlashed) {
        setTodos((current) =>
          current.map((todo) => {
            if (todo.id === todoBeingUpdated.id) {
              return { ...todo, beingSlashed: true };
            }
            return todo;
          })
        );
      } else if (todoBeingUpdated.beingDeleted) {
        setTodos((current) =>
          current.map((todo) => {
            if (todo.id === todoBeingUpdated.id) {
              return { ...todo, beingDeleted: true };
            }
            return todo;
          })
        );
      } else if (todoBeingUpdated.beingRevived) {
        setTodos((current) =>
          current.map((todo) => {
            if (todo.id === todoBeingUpdated.id) {
              return { ...todo, beingRevived: true };
            }
            return todo;
          })
        );
      }
    } else if (
      todos.some(
        (todo: Todo) =>
          todo.beingUpdated || todo.beingSlashed || todo.beingDeleted || todo.beingAdded || todo.beingRevived
      )
    ) {
      setTodos((current) =>
        current.map((todo) => {
          if (todo.beingUpdated || todo.beingSlashed || todo.beingDeleted || todo.beingAdded || todo.beingRevived) {
            return {
              ...todo,
              beingUpdated: false,
              beingSlashed: false,
              beingDeleted: false,
              beingAdded: false,
              beingRevived: false,
            };
          }
          return todo;
        })
      );
    }
  }, [todoBeingUpdated]);

  const getTodos = async () => {
    const todos = await todoService?.getTodos(user?.id);
    setTodos(todos || []);
  };

  useEffect(() => {
    if (selectedTodo) {
      debounceUpdateTodo(selectedTodoRef?.current);
    }
  }, [selectedTodo]);

  useEffect(() => {
    if (router.isReady) {
      if (!localStorage.getItem('already_onboarded')) {
        setOnboardingModalOpen(true);
        localStorage.setItem('already_onboarded', 'true');
      }
      const homeMenuOptionsDefault: OptionMenuItem[] = [
        {
          label: 'Hide Completed',
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
        {
          label: 'Show Deleted',
          action: (item: OptionMenuItem) => {
            setShowDeleted((current) => !current);
          },
          className: '',
          icon: TrashIcon,
        },
      ];
      setHomeMenuOptions(homeMenuOptionsDefault);
      getTodos();
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
        <div className="relative w-full flex flex-row items-center justify-between">
          <h1 className="text-2xl text-th-primary-dark">Home</h1>
          <OptionMenu options={homeMenuOptions} />
        </div>
        <div className="relative w-full flex flex-row items-center justify-between">
          <input
            placeholder="New Task..."
            onKeyDown={(e) => addNewTodo(e)}
            onChange={(e) => setNewTodoString(e.target.value)}
            value={newTodoString}
            disabled={!user}
            className={classNames(
              'rounded-md text-base w-full px-3 py-2 focus:ring-th-accent-medium focus:ring-1 focus:outline-none placeholder:text-th-primary-dark placeholder:opacity-30 text-th-primary-medium border border-th-accent-medium bg-th-background',
              {
                'opacity-50': !user,
              }
            )}
          />
          {loadingAdd && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <Spinner size="sm" className="text-th-accent-medium" />
            </div>
          )}
        </div>
        <div className="flex flex-col w-full items-start justify-start">
          <TodoDisclosure
            title="Todos"
            todos={todos
              .sort((a, b) => (a.deleted ? 1 : -1))
              .filter((todoFromList) => todoFromList.status === status.TODO)}
            showDescription={showDescription}
            showDeleted={showDeleted}
            setSelectedTodo={(todo: Todo) => setSelectedTodo(todo)}
            onRevive={(todo) => reviveTodo(todo)}
            onDelete={(todo?: Todo) => deleteTodo(todo)}
            onChange={(todo: Todo, status: status) => {
              updateTodo({ ...todo, status }, true);
            }}
          />
          {showCompleted && (
            <TodoDisclosure
              title="Completed"
              todos={todos
                .sort((a, b) => (a.deleted ? 1 : -1))
                .filter((todoFromList) => todoFromList.status === status.COMPLETED)}
              showDescription={showDescription}
              onRevive={(todo) => reviveTodo(todo)}
              showDeleted={showDeleted}
              setSelectedTodo={(todo: Todo) => setSelectedTodo(todo)}
              onDelete={(todo?: Todo) => deleteTodo(todo)}
              onChange={(todo: Todo, status: status) => {
                updateTodo({ ...todo, status }, true);
              }}
            />
          )}
        </div>
      </div>
      <div
        className={classNames(
          'min-h-screen relative transition-all duration-300 h-full mt-12 flex flex-col space-y-3 p-4',
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
              setTodos((current: Todo[]): Todo[] =>
                current.map((t) => (t.id === selectedTodo?.id ? selectedTodoRef.current : t))
              );
              setSelectedTodo((current) => ({ ...current, task: e.target.value }));
            }}
            value={selectedTodo?.task || ''}
          />
          <div className="flex flex-row items-center justify-end gap-2">
            <button className="rounded-full p-1 flex flex-col justify-center items-center">
              {autoSaving && <Spinner size="sm" className="text-th-accent-medium" />}
              {!autoSaving && autoSaved && <CheckIcon className="h-6 w-6 text-th-accent-medium" />}
            </button>
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
              setTodos((current: Todo[]): Todo[] =>
                current.map((t) => (t.id === selectedTodo?.id ? selectedTodoRef.current : t))
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
      <OnboardingModal open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />
    </div>
  );
};

export default Home;
