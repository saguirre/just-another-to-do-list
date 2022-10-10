import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface StaticDesktopSidebarProps {
  navigation: any[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const StaticDesktopSidebar: React.FC<StaticDesktopSidebarProps> = ({ navigation, collapsed, setCollapsed }) => {
  const { theme } = useTheme();
  return (
    <div
      className={classNames('hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 transition-all duration-300', {
        'md:w-28': collapsed,
      })}
    >
      <div
        className={classNames(' hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 transition-all duration-300', {
          'md:w-20': collapsed,
        })}
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
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-th-accent-dark border-r border-th-accent-medium">
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {!collapsed ? (
                    <Link href={item.href}>
                      <div
                        className={classNames(
                          item.current
                            ? 'text-th-primary-extra-light bg-th-accent-medium'
                            : 'text-th-primary-extra-light hover:bg-th-accent-medium rounded-md hover:pl-2 hover:scale-105 hover:translate-x-1.5 w-[95%] transition-all',
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
                  ) : (
                    <Link href={item.href}>
                      <div
                        className={classNames(
                          item.current
                            ? theme === 'dark'
                              ? 'text-th-primary-extra-light bg-th-accent-medium'
                              : 'text-th-accent-medium bg-th-accent-medium'
                            : 'text-th-primary-extra-light hover:bg-th-accent-medium rounded-md hover:pl-2 hover:scale-105 w-[95%] translate-x-0.5 transition-all',
                          'group flex justify-center items-center px-2 py-2 text-sm font-medium hover:cursor-pointer rounded-md'
                        )}
                      >
                        <item.icon className="flex-shrink-0 h-6 w-6 text-th-primary-extra-light" aria-hidden="true" />
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
