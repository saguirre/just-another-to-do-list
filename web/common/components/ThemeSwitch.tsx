import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-2 justify-start">
      <MoonIcon
        className={classNames('h-5 w-5 ', {
          'text-yellow-400': theme === 'dark',
          hidden: theme === 'light',
        })}
      />
      <SunIcon
        className={classNames('h-5 w-5', {
          'text-slate-600': theme === 'light',
          hidden: theme === 'dark',
        })}
      />
      <Switch.Group>
        <Switch.Label className="capitalize text-slate-600 dark:text-yellow-400 transition-all ease-in duration-300">
          {theme}
        </Switch.Label>
        <Switch
          checked={theme === 'dark'}
          onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`${
            theme === 'dark'
              ? 'bg-gradient-to-r from-orange-400 to-orange-500'
              : 'bg-gradient-to-r from-orange-400 to-orange-500'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </Switch.Group>
    </div>
  );
};
