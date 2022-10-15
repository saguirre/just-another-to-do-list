import { Popover, Transition } from '@headlessui/react';
import { Provider } from '@supabase/supabase-js';
import classNames from 'classnames';
import { Fragment } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { ArrowUturnRightIcon } from '@heroicons/react/24/outline';

const authProviders: { name: string; provider: Provider; redirectTo: string; icon: any }[] = [
  {
    name: 'Github',
    provider: 'github',
    redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
    icon: AiOutlineGithub,
  },
  {
    name: 'Discord',
    provider: 'discord',
    redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
    icon: FaDiscord,
  },
  {
    name: 'Google',
    provider: 'google',
    redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
    icon: FcGoogle,
  },
];

export const LoginButton = () => {
  const { theme } = useTheme();
  const { supabaseClient } = useSessionContext();
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <div className="absolute -left-4 -bottom-4">
            <div className="relative flex flex-row items-center justify-start gap-2 w-[200px]">
              <ArrowUturnRightIcon className="absolute left-[0px] -top-4 h-4 w-4 text-th-primary-dark rotate-[-40deg]" />
              <span className="absolute text-sm left-[18px] -top-3 text-th-primary-light">Login to get started!</span>
            </div>
          </div>
          <Popover.Button
            className={classNames(
              'group inline-flex items-center rounded-md bg-th-background hover:bg-th-background-secondary px-6 py-2 text-base border border-th-accent-dark font-medium text-th-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
              {
                'text-opacity-90': open,
              }
            )}
          >
            <span>Login</span>
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
            <Popover.Panel className="absolute -left-[35px] md:-left-[130px] z-10 mt-3 w-screen max-w-xs md:max-w-sm -translate-x-1/3 md:-translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md rounded-md">
              <div className="overflow-hidden divide-y divide-th-primary-medium rounded-lg p-4  bg-th-background-secondary shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-th-primary-light text-center mb-4">
                    Forget about passwords! Sign in using your favorite Auth provider!
                  </span>
                </div>
                <div className="relative grid gap-8 pt-6 pb-4 px-6 bg-th-background-secondary lg:grid-cols-2">
                  {authProviders.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        supabaseClient.auth.signInWithOAuth({ provider: item.provider });
                      }}
                      className="-m-3 flex flex-row justify-center md:justify-start items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-th-background-third focus:outline-none focus-visible:ring focus-visible:ring-th-accent-medium focus-visible:ring-opacity-50"
                    >
                      <item.icon
                        className={classNames(
                          'h-10 w-10 shrink-0 mr-2',
                          item.provider === 'discord' ? 'text-[#7289da]' : ''
                        )}
                      />
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
  );
};
