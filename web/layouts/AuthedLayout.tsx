import { Transition, Dialog } from '@headlessui/react';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import classNames from 'classnames';
import {
  ArrowLeftOnRectangleIcon,
  Bars3CenterLeftIcon,
  Bars3Icon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { StaticDesktopSidebar } from '../common/components/StaticDesktopSidebar';
import { ThemePopover } from '../common/components/ThemePopover';
import { MobileSidebar } from '../common/components/MobileSidebar';
import { useTranslation } from 'next-i18next';

interface AuthedLayoutProps {
  children: React.ReactNode;
}

export const AuthedLayout: React.FC<AuthedLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation('common');
  const navigation = [
    { name: t('sidebar.home'), href: '#', icon: HomeIcon, current: true },
    { name: t('sidebar.projects'), href: '#', icon: FolderIcon, current: false },
  ];

  return (
    <>
      <Head>
        <title>Just Another To-Do List</title>
        <meta name="description" content="Yeah, we know..." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      </Head>

      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
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
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
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
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                        >
                          <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <StaticDesktopSidebar
          navigation={navigation}
          collapsed={collapsed}
          setCollapsed={(collapsed: boolean) => setCollapsed(collapsed)}
        />
        {/* Sidebar for mobile */}
        <MobileSidebar navigation={navigation} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div
          className={classNames(
            'sticky top-0 z-20 flex-shrink-0 flex flex-row items-center md:justify-end md:px-2 justify-between h-16 transition-all duration-300 bg-th-background',
            {
              'md:ml-72': !collapsed,
              'md:ml-28': collapsed,
            }
          )}
        >
          <button
            type="button"
            className="ml-2 text-th-primary-medium p-2 flex flex-col items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-th-accent-dark md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-row items-center justify-end gap-2 px-2">
            <ThemePopover />
          </div>
        </div>
        <div
          className={classNames('flex flex-col flex-1 transition-all duration-300 pb-8', {
            'md:pl-72': !collapsed,
            'md:pl-28': collapsed,
          })}
        >
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};
