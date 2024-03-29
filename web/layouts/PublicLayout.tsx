import Head from 'next/head';
import { useState } from 'react';
import classNames from 'classnames';
import { Bars3Icon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline';
import { StaticDesktopSidebar } from '../common/components/StaticDesktopSidebar';
import { ThemePopover } from '../common/components/ThemePopover';
import { LoginButton } from '../common/components/LoginButton';
import { MobileSidebar } from '../common/components/MobileSidebar';
import { useTranslation } from 'next-i18next';
import { LanguagePopover } from '../common/components/LanguagePopover';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation('common');

  const navigation = [{ name: t('sidebar.home'), href: '#', icon: HomeIcon, current: true }];
  return (
    <>
      <Head>
        <title>Just Another To-Do List</title>
        <meta name="description" content="Yeah, we know..." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      </Head>

      <div>
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
              'md:ml-20': collapsed,
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
            <LanguagePopover/>
            <LoginButton />
            <ThemePopover />
          </div>
        </div>
        <div
          className={classNames('flex flex-row items-center md:flex-col flex-1 transition-all duration-300', {
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
