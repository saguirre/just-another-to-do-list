import { Popover, Transition } from '@headlessui/react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { Provider } from '@supabase/supabase-js';
import classNames from 'classnames';
import { Fragment } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';

const authProviders: { name: string; provider: Provider; redirectTo: string; icon: any }[] = [
  {
    name: 'Github',
    provider: 'github',
    redirectTo: 'http://localhost:3000',
    icon: AiOutlineGithub,
  },
  {
    name: 'Discord',
    provider: 'discord',
    redirectTo: 'http://localhost:3000',
    icon: FaDiscord,
  },
  {
    name: 'Google',
    provider: 'google',
    redirectTo: 'http://localhost:3000',
    icon: FcGoogle,
  },
];

export const LoginButton = () => {
  return (
    <div className="fixed top-4 right-40">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={classNames(
                'group inline-flex items-center rounded-md bg-th-primary-extra-light px-6 py-2 text-base border border-th-accent-dark font-medium text-th-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
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
              <Popover.Panel className="absolute -left-[130px] z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md border border-th-primary-medium rounded-md">
                <div className="overflow-hidden divide-y divide-th-primary-medium rounded-lg p-4 bg-th-background shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-th-primary-light text-center mb-4">
                      Forget about passwords! Sign in using your favorite Auth provider!
                    </span>
                  </div>
                  <div className="relative grid gap-8 pt-6 pb-4 px-6 bg-th-background lg:grid-cols-2">
                    {authProviders.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          supabaseClient.auth.signIn({ provider: item.provider }, { redirectTo: item.redirectTo });
                        }}
                        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-th-background-secondary focus:outline-none focus-visible:ring focus-visible:ring-th-accent-medium focus-visible:ring-opacity-50"
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
    </div>
  );
};
