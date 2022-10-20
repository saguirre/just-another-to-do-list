import { Dialog, Menu, Transition } from '@headlessui/react';
import { ArrowLeftOnRectangleIcon, ChevronUpDownIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';
import classNames from 'classnames';
import Link from 'next/link';
import router from 'next/router';
import { Fragment, useContext } from 'react';
import { TagContext } from '../contexts/tag.context';
import { TagVerticalList } from './TagVerticalList';

interface MobileSidebarProps {
  navigation: any[];
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}
export const MobileSidebar: React.FC<MobileSidebarProps> = ({ sidebarOpen, setSidebarOpen, navigation }) => {
  const user = useUser();
  const { supabaseClient } = useSessionContext();
  const { tags, setTags } = useContext(TagContext);
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-th-background border-r border-th-background-secondary">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-th-background-third"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-th-background-third" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              {user && (
                <Menu as="div" className="px-2 mt-1 mb-3 relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className={classNames(
                        'group w-full rounded-md py-2 text-sm text-left font-medium text-gray focus:outline-none transition-transform duration-300',
                        {
                          'px-3.5 bg-th-background-secondary hover:bg-th-background-third': !sidebarOpen,
                          'px-3 bg-th-background hover:bg-th-background-secondary': sidebarOpen,
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
                          {sidebarOpen && (
                            <span className="flex-1 flex flex-col min-w-0">
                              <span className="text-th-primary-extra-light text-sm font-medium truncate">
                                {user?.email}
                              </span>
                              <span className="text-th-primary-extra-light text-sm capitalize truncate">
                                {user?.app_metadata.provider}
                              </span>
                            </span>
                          )}
                        </span>
                        {sidebarOpen && (
                          <ChevronUpDownIcon
                            className="flex-shrink-0 h-5 w-5 text-th-primary-extra-light"
                            aria-hidden="true"
                          />
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
                          <span className="text-xs text-th-primary-medium">View Profile</span>
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
                          <span className="text-xs text-th-primary-medium">Logout</span>
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link href={item.href}>
                        <div
                          className={classNames(
                            item.current
                              ? 'text-th-primary-extra-light bg-th-background-secondary'
                              : 'text-th-primary-extra-light hover:bg-th-background-secondary rounded-md hover:pl-2 hover:scale-105 hover:translate-x-1.5 w-[95%] transition-all',
                            'group flex items-center px-2 py-2 text-sm font-medium  hover:cursor-pointer rounded-md'
                          )}
                        >
                          <item.icon
                            className="mr-3 flex-shrink-0 h-6 w-6 text-th-primary-extra-light"
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                      </Link>
                    </div>
                  ))}
                </nav>
                {user && (
                  <div className="px-2 pb-4 min-h-fit text-ellipsis">
                    <TagVerticalList
                      isMobile
                      collapsed={!sidebarOpen}
                      setCollapsed={setSidebarOpen}
                      tags={tags}
                      setTags={setTags}
                    />
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
