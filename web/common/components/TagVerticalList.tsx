import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon, TagIcon as TagIconOutline } from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';
import { TodoContext } from '../contexts/todo.context';
import { Tag } from '../models/tag';
import { Todo } from '../models/todo';

interface TagVerticalListProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  className?: string;
  isMobile?: boolean;
}

export const TagVerticalList: React.FC<TagVerticalListProps> = ({
  tags,
  collapsed,
  isMobile,
  setCollapsed,
  className,
}) => {
  const { t } = useTranslation('common');
  const { setTodoFilter, setFilterActive } = useContext(TodoContext);
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex flex-row items-center justify-start transition-all duration-300 gap-2 px-2 py-2 hover:bg-th-background-secondary rounded-md w-full">
            {open && !collapsed ? (
              <ChevronDownIcon className="h-3 w-3 text-th-primary-light" />
            ) : (
              <ChevronRightIcon className="h-3 w-3 text-th-primary-light" />
            )}
            <TagIcon className="h-5 w-5 text-th-primary-light" />
            {!collapsed && <h2 className="text-th-primary-light">{t('sidebar.tags')}</h2>}
          </Disclosure.Button>

          <Transition
            as="div"
            show={open && !collapsed}
            className={classNames('w-full', {
              'h-auto': open && !collapsed,
              'h-0': !open || collapsed,
            })}
            enter="transition-all duration-300 ease-in"
            enterFrom="transform opacity-0"
            enterTo="transform scale-y-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-y-100 opacity-100"
            leaveTo="transform scale-y-0 opacity-0"
          >
            <Disclosure.Panel className="flex flex-col w-full items-start justify-start md:pl-2">
              <div
                className={classNames(
                  'flex flex-col w-full flex-nowrap items-start justify-start py-1 px-2 rounded-b-lg gap-0.5',
                  className
                )}
              >
                {tags.map((tag: Tag) => {
                  return (
                    <div
                      onClick={() => {
                        if (isMobile) {
                          setCollapsed(false);
                        }
                        setTodoFilter(
                          () => (todo: Todo) => todo?.todoTags?.some((todoTag) => todoTag?.tag?.id === tag?.id) || false
                        );
                        setFilterActive(true);
                      }}
                      key={tag?.id + tag?.name}
                      className="py-1 hover:cursor-pointer text-th-primary-light hover:bg-th-background-secondary rounded-md hover:pl-2 hover:scale-105 hover:translate-x-1.5 w-[95%] transition-all"
                    >
                      <span
                        //@ts-ignore
                        className={classNames(
                          'flex flex-row items-center justify-between gap-2 w-full text-ellipsis flex-nowrap rounded-full px-2.5 py-1 font-semibold text-sm text-th-primary-light',
                          {
                            'bg-th-background': !tag?.color?.length,
                          }
                        )}
                      >
                        <div className="w-fit flex flex-row items-center justify-start gap-2">
                          <div className="w-fit h-fit relative">
                            <TagIcon className="h-4 w-4" style={{ color: `#${tag.color}` }} />
                            <TagIconOutline className="absolute z-10 top-0 left-0 h-4 w-4 text-th-primary-light" />
                          </div>
                          <span className="text-ellipsis">{tag.name}</span>
                        </div>
                      </span>
                    </div>
                  );
                })}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};
