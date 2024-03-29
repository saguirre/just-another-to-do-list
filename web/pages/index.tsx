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
import { status, todoPriority } from '@prisma/client';
import { TodoContext } from '../common/contexts/todo.context';
import { ServiceContext } from '../common/contexts/service.context';
import { debounce } from 'lodash';
import useState from 'react-usestateref';
import { TbFilterOff, TbTrashOff } from 'react-icons/tb';
import { OnboardingModal } from '../common/components/OnboardingModal';
import { TaskInput } from '../common/components/TaskInput';
import { toast } from 'react-toastify';
import { EditTask } from '../common/components/EditTask';
import { LoadingWrapper } from '../common/components/LoadingWrapper';
import { Tag } from '../common/models/tag';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TagContext } from '../common/contexts/tag.context';

const Home: NextPage = () => {
  const { t } = useTranslation(['pages', 'common']);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [homeMenuOptions, setHomeMenuOptions] = useState<OptionMenuItem[]>([]);
  const { todos, setTodos, todoFilter, setTodoFilter, filterActive, setFilterActive } = useContext(TodoContext);
  const { tags, setTags } = useContext(TagContext);
  const { todoService } = useContext(ServiceContext);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo, selectedTodoRef] = useState<Todo | undefined>();
  const [newTodoString, setNewTodoString] = useState<string>('');
  const [todoBeingUpdated, setTodoBeingUpdated] = useState<Todo>();
  const [autoSaving, setAutosaving] = useState<boolean>(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);
  const [autoSaved, setAutosaved] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<todoPriority | undefined>({ id: 4, name: 'None' });
  const user = useUser();
  const debounceUpdateTodo = useCallback(
    debounce(async (todo: Todo) => {
      setAutosaving(true);
      const { todoTags, id, todosPriority, ...todoToSend } = todo;
      const updatedTodo = await todoService?.updateTodoById({ ...todoToSend }, todo?.id, user?.id);
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
        task: newTodoString,
        createdAt: new Date(),
        status: status.TODO,
      };

      const optimisticTodo = { ...newTodo, id: 99999999 * Math.random() };
      setTodos((current: Todo[]): Todo[] => [...current, optimisticTodo]);
      setNewTodoString('');
      const tagsToSend = selectedTags;
      setSelectedTags([]);
      setSelectedPriority({ id: 4, name: t('common.priorities.none') });
      const addedTodo = await todoService?.createTodo(newTodo, user?.id, tagsToSend, selectedPriority);

      if (addedTodo) {
        setTodos((current: Todo[]): Todo[] =>
          current.map((todo) => {
            if (todo.id === optimisticTodo.id) {
              return addedTodo;
            }
            return todo;
          })
        );
        setTags((current: Tag[]) => [
          ...current,
          ...(addedTodo.todoTags
            ?.filter((todoTag) => !tags.some((tag) => tag.name?.toLowerCase() === todoTag.tag.name?.toLowerCase()))
            ?.map((todoTag) => ({ ...todoTag.tag })) || []),
        ]);
      } else {
        toast.error('There was an error adding your task');
        setTodos((current: Todo[]): Todo[] => current.filter((todo) => todo.id !== optimisticTodo.id));
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
    const { todoTags, todosPriority, ...todoToSend } = todo;
    const updatedTodo = await todoService?.updateTodoById(todoToSend, todo?.id, user?.id);
    if (!updatedTodo) {
      toast.error('There was an error updating your task');
      setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === previousTodo?.id ? previousTodo || {} : t)));
    }
    setTodoBeingUpdated(undefined);
  };

  const deleteTodo = async (todo?: Todo) => {
    if (todo) {
      const todoToDelete = { ...todo, beingDeleted: true };
      setTodoBeingUpdated(todoToDelete);
      const previousTodo = todo;
      todo.deleted = !todo.deleted;
      setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === todo.id ? todo : t)));
      if (todo?.id === selectedTodoRef.current?.id) {
        setSelectedTodo(undefined);
      }
      setTimeout(() => {
        setTodoBeingUpdated(undefined);
      }, 300);

      const deletedTodo = await todoService?.deleteTodoById(todo?.id, user?.id);
      if (!deletedTodo) {
        toast.error('There was an error updating your task');
        setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === previousTodo.id ? previousTodo : t)));
      }
    }
  };

  const reviveTodo = async (todo?: Todo) => {
    if (todo) {
      const todoToRevive = { ...todo, beingRevived: true };
      setTodoBeingUpdated(todoToRevive);
      const previousTodo = todo;
      todo.deleted = !todo.deleted;
      setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === todo.id ? todo : t)));
      setTimeout(() => {
        setTodoBeingUpdated(undefined);
      }, 300);
      const { todoTags, todosPriority, ...todoToSend } = todo;
      const revivedTodo = await todoService?.updateTodoById({ ...todoToSend, deleted: false }, todo?.id, user?.id);
      if (!revivedTodo) {
        setTodos((current: Todo[]): Todo[] => current.map((t) => (t.id === previousTodo.id ? previousTodo : t)));
      }
    }
  };

  useEffect(() => {
    setHomeMenuOptions((current) =>
      current.map((option: OptionMenuItem) => {
        if (option.label.toLowerCase().includes('completed') || option.label.toLowerCase().includes('completadas')) {
          const newOption = {
            ...option,
            label: showCompleted ? t('home.homeDropdown.hideCompleted') : t('home.homeDropdown.showCompleted'),
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
        if (option.label.toLowerCase().includes('deleted') || option.label.toLowerCase().includes('borradas')) {
          const label = showDeleted ? t('home.homeDropdown.hideDeleted') : t('home.homeDropdown.showDeleted');
          const newOption = {
            ...option,
            label,
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
        if (option.label.toLowerCase().includes('details') || option.label.toLowerCase().includes('detalles')) {
          const newOption = {
            ...option,
            label: showDescription ? t('home.homeDropdown.hideDetails') : t('home.homeDropdown.showDetails'),
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
    setLoading(false);
  };

  useEffect(() => {
    if (selectedTodo) {
      debounceUpdateTodo(selectedTodoRef?.current || {});
    }
  }, [selectedTodo]);

  useEffect(() => {
    if (router.isReady) {
      if (!localStorage.getItem('already_onboarded')) {
        setOnboardingModalOpen(true);
      }
      const homeMenuOptionsDefault: OptionMenuItem[] = [
        {
          label: t('home.homeDropdown.hideCompleted'),
          action: (item: OptionMenuItem) => {
            setShowCompleted((current) => !current);
          },
          className: '',
          icon: EyeSlashIcon,
        },
        {
          label: t('home.homeDropdown.showDetails'),
          action: (item: OptionMenuItem) => {
            setShowDescription((current) => !current);
          },
          className: '',
          icon: Bars3BottomLeftIcon,
        },
        {
          label: t('home.homeDropdown.showDeleted'),
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
    <LoadingWrapper loading={loading}>
      <div
        className={classNames('flex h-screen w-full flex-col md:flex-row items-center justify-center py-2', {
          'md:w-screen': !user,
        })}
      >
        <div
          className={classNames(
            'w-screen overflow-y-scroll min-h-screen h-full flex flex-col space-y-3 p-4 transition-all duration-300',
            {
              'mt-0 md:w-1/2': selectedTodo,
              'mt-6 md:w-2/3': !selectedTodo,
            }
          )}
        >
          <div className="relative w-full flex flex-row items-center justify-between">
            <h1 className="text-2xl text-th-primary-dark">{t('home.title')}</h1>
            <OptionMenu options={homeMenuOptions} />
          </div>
          <TaskInput
            placeholder={t('home.taskInput.placeholder')}
            tags={tags}
            setSelectedPriority={setSelectedPriority}
            selectedPriority={selectedPriority}
            setTags={setTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            onKeyDown={(e) => addNewTodo(e)}
            onChange={(value: string) => setNewTodoString(value)}
            value={newTodoString}
            disabled={!user}
          />
          {filterActive && (
            <button
              className="flex flex-row items-center justify-center gap-2 bg-th-background-secondary hover:bg-th-background-third rounded-md p-2 text-th-primary-medium text-sm"
              onClick={() => {
                setTodoFilter(() => () => true);
                setFilterActive(false);
              }}
            >
              {t('home.clearFilters')}
              <TbFilterOff className="h-5 w-5" />
            </button>
          )}
          <div className="flex flex-col w-full items-start justify-start">
            <TodoDisclosure
              title={t('home.tasks')}
              todos={todos
                .filter((todo: Todo) => todoFilter(todo))
                .sort((a, b) => (a.deleted ? 1 : -1))
                .filter((todoFromList) => todoFromList.status === status.TODO)}
              setTodos={setTodos}
              showDescription={showDescription}
              showDeleted={showDeleted}
              setSelectedTodo={(todo?: Todo) => setSelectedTodo(todo)}
              onRevive={(todo) => reviveTodo(todo)}
              onDelete={(todo?: Todo) => deleteTodo(todo)}
              onChange={(todo: Todo, status: status) => {
                updateTodo({ ...todo, status }, true);
              }}
            />
            {showCompleted && (
              <TodoDisclosure
                title={t('home.completed')}
                todos={todos
                  .filter((todo: Todo) => todoFilter(todo))
                  .sort((a, b) => (a.deleted ? 1 : -1))
                  .filter((todoFromList) => todoFromList.status === status.COMPLETED)}
                setTodos={setTodos}
                showDescription={showDescription}
                onRevive={(todo) => reviveTodo(todo)}
                showDeleted={showDeleted}
                setSelectedTodo={(todo?: Todo) => setSelectedTodo(todo)}
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
              current.map((t) => (t.id === selectedTodo?.id ? selectedTodoRef.current || {} : t))
            );
            setSelectedTodo((current) => ({ ...current, task: value }));
          }}
          onClose={() => setSelectedTodo(undefined)}
          onTextAreaChange={(value: string) => {
            setTodos((current: Todo[]): Todo[] =>
              current.map((t) => (t.id === selectedTodo?.id ? selectedTodoRef.current || {} : t))
            );
            setSelectedTodo((current) => ({ ...current, description: value }));
          }}
        />
        <OnboardingModal open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />
      </div>
    </LoadingWrapper>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'es', ['common', 'pages'])),
  },
});

export default Home;
