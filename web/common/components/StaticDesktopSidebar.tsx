import { Menu, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceContext } from '../contexts/service.context';
import { TagContext } from '../contexts/tag.context';
import { TodoContext } from '../contexts/todo.context';
import { TagVerticalList } from './TagVerticalList';

interface StaticDesktopSidebarProps {
  navigation: any[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const StaticDesktopSidebar: React.FC<StaticDesktopSidebarProps> = ({ navigation, collapsed, setCollapsed }) => {
  const router = useRouter();
  const user = useUser();
  const { tagService } = useContext(ServiceContext);
  const { tags, setTags } = useContext(TagContext);
  const { supabaseClient } = useSessionContext();
  const { t } = useTranslation('common');

  const getTags = async () => {
    const userTags = await tagService?.getTags(user?.id);
    setTags(userTags || []);
  };

  useEffect(() => {
    if (user) {
      getTags();
    }
  }, [user]);
  return (
    <div
      className={classNames(
        'min-h-screen h-full hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 transition-all duration-300',
        {
          'md:w-28': collapsed,
        }
      )}
    >
      <div
        className={classNames(
          'min-h-screen h-full hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 transition-all duration-300',
          {
            'md:w-20': collapsed,
          }
        )}
      >
        <div
          className={classNames('absolute top-[10%] transition-all duration-300 z-20', {
            'left-20': collapsed,
            'left-64': !collapsed,
          })}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex flex-col items-center justify-center h-16 m-0 rounded-r-2xl pt-0.5 pb-1 pl-0.5 hover:bg-th-background-secondary"
            >
              <ChevronRightIcon className="h-6 w-6 text-th-accent-light" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex flex-col items-center justify-center h-16 m-0 rounded-r-2xl pt-0.5 pb-1 pl-0.5 hover:bg-th-background-secondary"
            >
              <ChevronLeftIcon className="h-6 w-6 text-th-accent-light" />
            </button>
          )}
        </div>
        <div className="flex flex-col overflow-y-auto overflow-x-hidden scrollbar flex-grow pt-5 bg-th-background border-r border-th-accent-light">
          <div className="mt-5 flex flex-col justify-start">
            {user && (
              <Menu as="div" className="px-2 mt-1 mb-3 relative inline-block text-left">
                <div>
                  <Menu.Button
                    onClick={() => (collapsed ? setCollapsed(!collapsed) : null)}
                    className={classNames(
                      'group w-full rounded-md py-2 text-sm text-left font-medium text-gray focus:outline-none transition-transform duration-300',
                      {
                        'px-3.5 bg-th-background-secondary hover:bg-th-background-third': !collapsed,
                        'px-3 bg-th-background-secondary hover:bg-th-background-third': collapsed,
                      }
                    )}
                  >
                    <span className="flex w-full justify-between items-center">
                      <span className="flex min-w-0 items-center justify-between space-x-3">
                        <img
                          className="w-10 h-10 bg-th-background-secondary rounded-full flex-shrink-0"
                          src={user?.user_metadata.avatar_url}
                          alt=""
                        />
                        {!collapsed && (
                          <span className="flex-1 flex flex-col min-w-0">
                            <span className="text-th-primary-light text-sm font-medium truncate">{user?.email}</span>
                            <span className="text-th-primary-light text-sm capitalize truncate">
                              {user?.app_metadata.provider}
                            </span>
                          </span>
                        )}
                      </span>
                      {!collapsed && (
                        <ChevronUpDownIcon className="flex-shrink-0 h-5 w-5 text-th-primary-light" aria-hidden="true" />
                      )}
                    </span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-10 p-0 origin-top absolute ml-4 left-28 mt-1 ring-[0.5px] ring-th-background-secondary outline-none w-56 h-fit bg-th-background-secondary -translate-x-1/2 transform rounded-lg">
                    <Menu.Item>
                      <button className="w-full text-start hover:bg-th-background-third text-xs text-th-primary-medium p-3 rounded-t-lg flex flex-row items-center options-center justify-start gap-2">
                        <UserIcon className="h-4 w-4 text-th-primary-medium" />
                        <span className="text-xs text-th-primary-medium">{t('sidebar.dropdown.profile')}</span>
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={async () => {
                          await supabaseClient.auth.signOut();
                          router.push('/');
                        }}
                        className="w-full text-start hover:bg-th-background-third text-xs text-th-primary-medium p-3 rounded-b-lg flex flex-row items-center options-center justify-start gap-2"
                      >
                        <ArrowLeftOnRectangleIcon className="h-4 w-4 text-th-primary-medium" />
                        <span className="text-xs text-th-primary-medium">{t('sidebar.dropdown.logout')}</span>
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
            <nav className="min-h-fit h-fit flex flex-col justify-start px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {!collapsed ? (
                    <Link href={item.href}>
                      <div
                        className={classNames(
                          item.current
                            ? 'text-th-primary-light bg-th-background-secondary'
                            : 'text-th-primary-light hover:bg-th-background-secondary rounded-md hover:pl-2 hover:scale-105 hover:translate-x-1.5 w-[95%] transition-all',
                          'group flex items-center px-2 py-2 text-sm font-medium  hover:cursor-pointer rounded-md'
                        )}
                      >
                        <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-th-primary-light" aria-hidden="true" />
                        {item.name}
                      </div>
                    </Link>
                  ) : (
                    <Link href={item.href}>
                      <div
                        className={classNames(
                          item.current
                            ? 'text-th-primary-light bg-th-background-secondary'
                            : 'text-th-primary-light hover:bg-th-background-secondary rounded-md hover:pl-2 hover:scale-105 w-[95%] translate-x-0.5 transition-all',
                          'group flex justify-center items-center px-2 py-2 text-sm font-medium hover:cursor-pointer rounded-md'
                        )}
                      >
                        <item.icon className="flex-shrink-0 h-6 w-6 text-th-primary-light" aria-hidden="true" />
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            {user && (
              <div className="px-2 pb-4 min-h-fit text-ellipsis">
                <TagVerticalList collapsed={collapsed} setCollapsed={setCollapsed} tags={tags} setTags={setTags} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
