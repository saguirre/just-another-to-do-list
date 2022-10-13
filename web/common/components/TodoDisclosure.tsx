import { Disclosure, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  StopIcon,
  TrashIcon,
  TagIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { status } from '@prisma/client';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { OptionMenuItem } from '../models/option-menu-item';
import { Todo } from '../models/todo';
import { OptionMenu } from './OptionMenu';
import { Spinner } from './Spinner';

interface TodoDisclosureProps {
  title: string;
  todos: Todo[];
  showDescription?: boolean;
  showDeleted?: boolean;
  setSelectedTodo: (todo: Todo) => void;
  onChange: (todo: Todo, status: status) => void;
  onDelete: (todo?: Todo) => void;
  onRevive: (todo?: Todo) => void;
}

export const TodoDisclosure: React.FC<TodoDisclosureProps> = ({
  title,
  todos,
  setSelectedTodo,
  onChange,
  onDelete,
  onRevive,
  showDescription,
  showDeleted,
}) => {
  const router = useRouter();
  const [menuOptions, setMenuOptions] = useState<OptionMenuItem[]>([]);
  const [deletedMenuOptions, setDeletedMenuOptions] = useState<OptionMenuItem[]>([]);

  useEffect(() => {
    if (router.isReady) {
      const menuOptionsDefault: OptionMenuItem[] = [
        {
          label: 'View Tags',
          action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => {},
          className: '',
          icon: TagIcon,
        },
        {
          label: 'Delete',
          action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => {
            onDelete(itemAttachedToOptions);
          },
          className: 'text-rose-400',
          icon: TrashIcon,
        },
      ];
      setMenuOptions(menuOptionsDefault);
      const deletedMenuOptions: OptionMenuItem[] = [
        {
          label: 'View Tags',
          action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => {},
          className: '',
          icon: TagIcon,
        },
        {
          label: 'Revive',
          action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => {
            onRevive(itemAttachedToOptions);
          },
          className: 'text-th-accent-medium',
          icon: BoltIcon,
        },
      ];
      setDeletedMenuOptions(deletedMenuOptions);
    }
  }, [router.isReady]);
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full flex flex-row items-center justify-start transition-all duration-300 gap-2 px-2 py-2 hover:bg-th-background-secondary rounded-md ">
            {open ? (
              <ChevronDownIcon className="h-3 w-3 text-th-primary-medium" />
            ) : (
              <ChevronRightIcon className="h-3 w-3 text-th-primary-medium" />
            )}
            <h2 className="text-th-primary-medium">{title}</h2>
          </Disclosure.Button>

          <Transition
            as="div"
            className={classNames('w-full', {
              'h-auto': open,
              'h-0': !open,
            })}
            enter="transition-all duration-300 ease-in"
            enterFrom="transform opacity-0"
            enterTo="transform scale-y-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-y-100 opacity-100"
            leaveTo="transform scale-y-0 opacity-0"
          >
            <Disclosure.Panel className="flex flex-col w-full items-start justify-start pl-4">
              {todos.map((todo) => {
                return (
                  <div key={todo?.id} className="w-full">
                    {(showDeleted || !todo?.deleted) && (
                      <div className="relative w-full">
                        <div
                          onClick={() => {
                            if (!todo?.deleted) {
                              setSelectedTodo(todo);
                            }
                          }}
                          className={classNames(
                            'flex flex-row w-full hover:bg-th-background-secondary items-center text-th-primary-medium justify-between px-2 py-2 rounded-md transition-all',
                            {
                              'opacity-50 duration-500': todo?.status === status.COMPLETED,
                              'opacity-50 hover:bg-th-background': todo?.deleted,
                              'bg-rose-400 scale-y-0 opacity-0 duration-700': todo?.beingDeleted,
                              'bg-th-accent-medium scale-y-0 opacity-0 duration-700':
                                todo?.beingRevived,
                              'translate-x-0 opacity-100 duration-500':
                                !todo?.beingSlashed && todo?.status === status.TODO,
                            }
                          )}
                        >
                          <div className="flex w-full flex-row items-center justify-start gap-3 transition-all duration-300">
                            {(todo.beingSlashed) && <Spinner size="sm" className="ml-1" />}
                            {!todo.beingSlashed && (
                              <>
                                {todo.status === status.COMPLETED ? (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!todo?.deleted) {
                                        onChange(todo, status.TODO);
                                      }
                                    }}
                                    className="flex flex-col justify-center items-center rounded-full p-1 hover:bg-th-background-third hover:ring-1 hover:ring-th-accent-dark"
                                  >
                                    <CheckCircleIcon className="h-5 w-5 text-th-primary-medium" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!todo?.deleted) {
                                        onChange(todo, status.COMPLETED);
                                      }
                                    }}
                                    className="flex flex-col justify-center items-center rounded-full p-1 hover:bg-th-background-third hover:ring-1 hover:ring-th-accent-dark"
                                  >
                                    <StopIcon className="h-5 w-5 text-th-primary-medium" />
                                  </button>
                                )}
                              </>
                            )}
                            <div className="flex flex-col items-start justify-start gap-0.5">
                              <div className="flex flex-row items-center justify-start gap-2">
                                <span
                                  className={classNames('text-sm text-th-primary-medium hover:cursor-default', {
                                    'line-through ': todo?.status === status.COMPLETED,
                                  })}
                                >
                                  {todo.task}
                                </span>
                                {todo?.deleted && (
                                  <span className="text-sm text-th-primary-medium hover:cursor-default">(Deleted)</span>
                                )}
                              </div>
                              {showDescription && todo?.description && todo?.description?.length > 0 && (
                                <div className="pl-0.5 flex flex-row items-start justify-start gap-1 w-full">
                                  <div className="h-0.5 w-1.5 bg-th-accent-medium mt-1.5 rounded-full"></div>
                                  <span className="text-xs text-th-primary-medium opacity-50 hover:cursor-default">
                                    {todo.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {todo.deleted ? (
                          <OptionMenu options={deletedMenuOptions} itemAttachedToOptions={todo} />
                        ) : (
                          <OptionMenu options={menuOptions} itemAttachedToOptions={todo} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};