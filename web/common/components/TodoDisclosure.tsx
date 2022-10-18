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

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTaskListItem } from './SortableTaskListItem';
import { TaskListItem } from './TaskListItem';
import { useTranslation } from 'next-i18next';

interface TodoDisclosureProps {
  title: string;
  todos: Todo[];
  showDescription?: boolean;
  showDeleted?: boolean;
  setTodos: (todos: any) => void;
  setSelectedTodo: (todo?: Todo) => void;
  onChange: (todo: Todo, status: status) => void;
  onDelete: (todo?: Todo) => void;
  onRevive: (todo?: Todo) => void;
}

export const TodoDisclosure: React.FC<TodoDisclosureProps> = ({
  title,
  todos,
  setTodos,
  setSelectedTodo,
  onChange,
  onDelete,
  onRevive,
  showDescription,
  showDeleted,
}) => {
  const router = useRouter();
  const { t } = useTranslation('pages');
  const [menuOptions, setMenuOptions] = useState<OptionMenuItem[]>([]);
  const [deletedMenuOptions, setDeletedMenuOptions] = useState<OptionMenuItem[]>([]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (router.isReady) {
      const menuOptionsDefault: OptionMenuItem[] = [
        {
          label: t('home.todoDropdown.viewTags'),
          action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => {},
          className: '',
          icon: TagIcon,
        },
        {
          label: t('home.todoDropdown.delete'),
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
          label: t('home.todoDropdown.viewTags'),
          action: (item: OptionMenuItem, itemAttachedToOptions?: Todo) => {},
          className: '',
          icon: TagIcon,
        },
        {
          label: t('home.todoDropdown.revive'),
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
  const handleDragStart = (event: any) => {
    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const moveTodosCallback = (todos: Todo[]) => {
        const oldIndex = todos.findIndex((todo) => todo.id === active.id);
        const newIndex = todos.findIndex((todo) => todo.id === over.id);

        return arrayMove(todos, oldIndex, newIndex);
      };
      setTodos(moveTodosCallback);
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
              <Disclosure.Panel className="flex flex-col w-full items-start justify-start md:pl-4">
                <SortableContext items={todos.map((todo) => todo.id || '')} strategy={verticalListSortingStrategy}>
                  {todos.map((todo) => {
                    return (
                      <SortableTaskListItem
                        id={todo.id}
                        key={todo.id}
                        onChange={onChange}
                        showDescription={showDescription}
                        showDeleted={showDeleted}
                        menuOptions={menuOptions}
                        deletedMenuOptions={deletedMenuOptions}
                        todo={todo}
                        setSelectedTodo={setSelectedTodo}
                      />
                    );
                  })}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <TaskListItem
                      onChange={onChange}
                      showDescription={showDescription}
                      showDeleted={showDeleted}
                      menuOptions={menuOptions}
                      deletedMenuOptions={deletedMenuOptions}
                      todo={todos.find((todo) => todo.id === activeId) || {}}
                      setSelectedTodo={setSelectedTodo}
                      id={activeId}
                    />
                  ) : null}
                </DragOverlay>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </DndContext>
  );
};
