import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { Fragment, useEffect, useState } from 'react';

const solutions: {
  name: string;
  theme: string;
  color: string;
  isDark?: boolean;
}[] = [
  {
    name: 'Light',
    theme: 'light',
    color: 'bg-blue-500',
  },
  {
    name: 'Dark',
    theme: 'dark',
    isDark: true,
    color: 'bg-blue-500',
  },
  { name: 'Pink', color: 'bg-pink-500', theme: 'pink' },
  { name: 'Dark Pink', color: 'bg-pink-500', isDark: true, theme: 'dark-pink' },
  { name: 'Green', color: 'bg-green-500', theme: 'green' },
  { name: 'Dark Green', color: 'bg-green-500', isDark: true, theme: 'dark-green' },
  { name: 'Amber', color: 'bg-amber-500', theme: 'amber' },
  { name: 'Dark Amber', color: 'bg-amber-500', isDark: true, theme: 'dark-amber' },
];

export const ThemePopover = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="fixed top-4 px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={classNames(
                'group inline-flex items-center rounded-md bg-th-accent-dark px-3 py-2 text-base font-medium text-th-primary-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
                {
                  'text-opacity-90': open,
                }
              )}
            >
              <span>Themes</span>
              <ChevronDownIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-th-primary-extra-light transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-[100px] z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-th-background-secondary p-4 lg:grid-cols-2">
                    {solutions.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setTheme(item.theme)}
                        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-th-background-third  focus:outline-none focus-visible:ring focus-visible:ring-th-accent-medium focus-visible:ring-opacity-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          <div
                            className={classNames('flex flex-col items-center justify-center h-8 w-8 rounded-full', {
                              'bg-slate-800 drop-shadow-lg': item.isDark,
                              'bg-white shadow-md': !item.isDark,
                            })}
                          >
                            <div className={classNames('z-10 h-4 w-4 rounded-full', item.color)}></div>
                          </div>
                        </div>
                        <div className="ml-0.5">
                          <p className="text-sm font-medium text-th-primary-light">{item.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
