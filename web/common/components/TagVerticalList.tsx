import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
}

export const TagVerticalList: React.FC<TagVerticalListProps> = ({ tags, collapsed, setCollapsed, className }) => {
  const { t } = useTranslation('common');
  const { setTodoFilter, setFilterActive } = useContext(TodoContext);
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex flex-row items-center justify-start transition-all duration-300 gap-2 px-2 py-2 hover:bg-th-accent-medium rounded-md w-full">
            {open && !collapsed ? (
              <ChevronDownIcon className="h-3 w-3 text-th-primary-extra-light" />
            ) : (
              <ChevronRightIcon className="h-3 w-3 text-th-primary-extra-light" />
            )}
            <TagIcon className="h-5 w-5 text-th-primary-extra-light" />
            {!collapsed && <h2 className="text-th-primary-extra-light">{t('sidebar.tags')}</h2>}
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
                        setTodoFilter(
                          () => (todo: Todo) => todo?.todoTags?.some((todoTag) => todoTag?.tag?.id === tag?.id) || false
                        );
                        setFilterActive(true);
                      }}
                      key={tag?.id + tag?.name}
                      className="py-1 hover:cursor-pointer text-th-primary-extra-light hover:bg-th-accent-medium rounded-md hover:pl-2 hover:scale-105 hover:translate-x-1.5 w-[95%] transition-all"
                    >
                      <span
                        //@ts-ignore
                        className={classNames(
                          'flex flex-row items-center justify-between gap-2 w-full text-ellipsis flex-nowrap rounded-full px-2.5 py-1 font-semibold text-sm text-th-primary-extra-light',
                          {
                            'bg-th-accent-dark': !tag?.color?.length,
                          }
                        )}
                      >
                        <div className="w-fit flex flex-row items-center justify-start gap-2">
                          <div className="w-fit h-fit relative">
                            <TagIcon className="h-5 w-5" />
                            <div
                              className="absolute inset-x-1/3 inset-y-[6.5px] h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: `#${tag.color}` }}
                            ></div>
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
