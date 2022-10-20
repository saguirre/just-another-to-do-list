import { CheckCircleIcon, StopIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Todo } from '../models/todo';
import { OptionMenu } from './OptionMenu';
import { Spinner } from './Spinner';
import { status } from '@prisma/client';
import { OptionMenuItem } from '../models/option-menu-item';
import { forwardRef } from 'react';
import { VscGrabber } from 'react-icons/vsc';
import { DraggableAttributes } from '@dnd-kit/core';
import { TagList } from './TagList';
import { PrioritySpan } from './PrioritySpan';

interface TaskListItemProps extends Partial<DraggableAttributes> {
  id: any;
  showDeleted?: boolean;
  showDescription?: boolean;
  onPointerDown?: any;
  onChange: (todo: Todo, status: status) => void;
  todo: Todo;
  setSelectedTodo: (todo?: Todo) => void;
  menuOptions: OptionMenuItem[];
  deletedMenuOptions: OptionMenuItem[];
  className?: string;
}
export const TaskListItem: React.FC<TaskListItemProps> = forwardRef<HTMLDivElement, TaskListItemProps>(
  (
    {
      showDeleted,
      todo,
      onChange,
      setSelectedTodo,
      showDescription,
      deletedMenuOptions,
      menuOptions,
      className,
      ...props
    },
    ref
  ) => {
    const { onPointerDown, ...data } = props;

    return (
      <div ref={ref} {...data} className={classNames('w-full', className)}>
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
                  'bg-th-accent-medium scale-y-0 opacity-0 duration-700': todo?.beingRevived,
                  'translate-x-0 opacity-100 duration-300': !todo?.beingSlashed && todo?.status === status.TODO,
                }
              )}
            >
              <div className="flex w-full flex-row items-center justify-start transition-all duration-300">
                <div
                  onPointerDown={onPointerDown}
                  className="hover:cursor-grab touch-none hover:bg-th-background-third active:cursor-grabbing p-1 rounded-md flex flex-col items-center justify-center"
                >
                  <VscGrabber className="text-th-primary-medium h-3.5 w-3.5" />
                </div>
                {todo?.beingSlashed && <Spinner size="sm" className="ml-2 mr-3" />}
                {!todo?.beingSlashed && (
                  <>
                    {todo?.status === status.COMPLETED ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!todo?.deleted) {
                            onChange(todo, status.TODO);
                          }
                        }}
                        className="flex flex-col ml-1 mr-2 justify-center items-center rounded-full p-1 hover:bg-th-background-third hover:ring-1 hover:ring-th-accent-dark"
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
                        className="flex flex-col ml-1 mr-2 justify-center items-center rounded-full p-1 hover:bg-th-background-third hover:ring-1 hover:ring-th-accent-dark"
                      >
                        <StopIcon className="h-5 w-5 text-th-primary-medium" />
                      </button>
                    )}
                  </>
                )}
                <div className="flex flex-col items-start justify-start gap-0.5">
                  <div className="flex flex-row items-center justify-start w-full pr-4 gap-2">
                    <span
                      className={classNames('text-sm text-th-primary-medium hover:cursor-default', {
                        'line-through ': todo?.status === status.COMPLETED,
                      })}
                    >
                      {todo?.task + (todo?.deleted ? ' (Deleted)' : '')}
                    </span>
                  </div>
                  {showDescription && todo?.description && todo?.description?.length > 0 && (
                    <div className="pl-0.5 flex flex-row items-start justify-start gap-1 w-full">
                      <div className="h-0.5 w-1.5 bg-th-accent-medium mt-1.5 rounded-full"></div>
                      <span className="text-xs text-th-primary-medium opacity-50 hover:cursor-default">
                        {todo.description}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-row items-center justify-start gap-2">
                    <div className="w-fit">
                      <PrioritySpan
                        size="sm"
                        hoverable={false}
                        selectedPriority={todo?.todosPriority}
                        setSelectedPriority={() => {}}
                      />
                    </div>
                    <TagList
                      size="sm"
                      hoverable={false}
                      className="bg-opacity-95"
                      tags={todo?.todoTags?.map((todoTag) => ({ ...todoTag.tag })) || []}
                      setTags={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
            {todo?.deleted ? (
              <OptionMenu options={deletedMenuOptions} itemAttachedToOptions={todo} />
            ) : (
              <OptionMenu options={menuOptions} itemAttachedToOptions={todo} />
            )}
          </div>
        )}
      </div>
    );
  }
);
