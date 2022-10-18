import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Flag from 'react-world-flags';

const flagOptions = [
  { language: 'en', code: 'USA', description: 'common:languages.english', current: true },
  { language: 'es', code: 'ESP', description: 'common:languages.spanish', current: false },
];

export const LanguagePopover = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [selected, setSelected] = useState(flagOptions.find((option) => option.language === i18n.language));

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    router.push(`/${language}${router.asPath}`, `/${language}${router.asPath}`, { locale: language });
  };

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change language</Listbox.Label>
          <div className="relative">
            <Listbox.Button className="flex flex-row items-center justify-center gap-2 bg-transparent p-2 mr-3 rounded-full text-sm font-medium text-primary-dark hover:ring-2 hover:ring-th-accent-dark focus:outline-none focus:z-10 focus:ring-2 focus:ring-th-accent-dark">
              <span className="sr-only">Change language</span>
              <div className="flex justify-center items-center w-6 h-6">
                <Flag code={selected?.code} className="rounded-sm" />
              </div>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="origin-top-right absolute z-10 right-0 mt-1 w-fit rounded-md shadow-lg overflow-hidden bg-th-background-secondary divide-y divide-th-background-third ring-1 ring-th-accent-dark ring-opacity-5 focus:outline-none">
                {flagOptions.map((option) => (
                  <Listbox.Option
                    key={option.code}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-th-primary-extra-light bg-th-accent-dark' : 'text-th-primary-dark',
                        'cursor-default select-none relative px-6 py-2 text-sm hover:cursor-pointer'
                      )
                    }
                    value={option}
                    onClick={() => changeLanguage(option.language)}
                  >
                    {({ active }) => (
                      <div className="flex flex-row gap-3 items-center justify-end">
                        <div className="flex flex-row gap-3 items-center justify-between">
                          <p
                            className={classNames(
                              active ? 'text-th-primary-extra-light' : 'text-th-primary-medium',
                              ''
                            )}
                          >
                            {t(option.description)}
                          </p>
                        </div>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <Flag code={option.code} className="rounded-sm" />
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
