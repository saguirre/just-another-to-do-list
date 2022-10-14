import { Bars3BottomLeftIcon, Bars3Icon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';
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
import { debounce } from 'lodash';
import useState from 'react-usestateref';
import { TbTrashOff } from 'react-icons/tb';
import { OnboardingModal } from '../common/components/OnboardingModal';
import { TaskInput } from '../common/components/TaskInput';
import { toast } from 'react-toastify';
import { EditTask } from '../common/components/EditTask';

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
    if (event.key === 'Enter' && newTodoString?.length > 0) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        task: newTodoString,
        createdAt: new Date(),
        status: status.TODO,
      };
      setTodos((current: Todo[]): Todo[] => [newTodo, ...current]);
      setNewTodoString('');
      const addedTodo = await todoService?.createTodo(newTodo, user?.id);
      if (addedTodo) {
        setTodos((current: Todo[]): Todo[] =>
          current.map((todo) => {
            if (todo.id === newTodo.id) {
              return addedTodo;
            }
            return todo;
          })
        );
      } else {
        toast.error('There was an error adding your task');
        setTodos((current: Todo[]): Todo[] => current.filter((todo) => todo.id !== newTodo.id));
      }
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
    const previousTodo = todos.find((todoFromList) => todoFromList.id === todo.id);
    setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === todo.id ? todo : t)));
    const updatedTodo = await todoService?.updateTodoById({ ...todo }, todo?.id, user?.id);
    if (!updatedTodo) {
      toast.error('There was an error updating your task');
      setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === previousTodo?.id ? previousTodo : t)));
    }
    setTodoBeingUpdated(undefined);
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
              beingUpdated: undefined,
              beingSlashed: undefined,
              beingDeleted: undefined,
              beingAdded: undefined,
              beingRevived: undefined,
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
        <TaskInput
          placeholder="Type out your Task and press enter."
          onKeyDown={(e) => addNewTodo(e)}
          onChange={(value: string) => setNewTodoString(value)}
          value={newTodoString}
          disabled={!user}
        />
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
      <EditTask
        autoSaved={autoSaved}
        autoSaving={autoSaving}
        selectedTask={selectedTodo}
        onInputChange={(value: string) => {
          setTodos((current: Todo[]): Todo[] =>
            current.map((t) => (t.id === selectedTodo?.id ? selectedTodoRef.current : t))
          );
          setSelectedTodo((current) => ({ ...current, task: value }));
        }}
        onClose={() => setSelectedTodo(undefined)}
        onTextAreaChange={(value: string) => {
          setTodos((current: Todo[]): Todo[] =>
            current.map((t) => (t.id === selectedTodo?.id ? selectedTodoRef.current : t))
          );
          setSelectedTodo((current) => ({ ...current, description: value }));
        }}
      />
      <OnboardingModal open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />
    </div>
  );
};

export default Home;
