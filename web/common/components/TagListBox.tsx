import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Tag } from '../models/tag';
import { useTranslation } from 'next-i18next';

interface TagListBoxProps {
  suggestions: Tag[];
  searchString?: string;
  open: boolean;
}
export const TagListBox: React.FC<TagListBoxProps> = ({ suggestions, searchString, open }) => {
  const { t } = useTranslation('common');
  return (
    <div className="absolute top-10 z-20 w-72">
      <Listbox>
        <div className="relative mt-1">
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute mt-1 max-h-60 w-fit break-all overflow-auto rounded-md bg-th-background-secondary py-1 text-base shadow-lg ring-1 ring-bg-th-background ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <div className="py-1 flex flex-row items-center justify-start gap-2 px-3 text-th-primary-medium text-sm w-full text-start">
                {t('tags.createTag')}
                <span className="inline-block w-fit flex-wrap bg-th-accent-dark rounded-full px-2.5 py-1 font-semibold text-sm text-th-primary-extra-light">
                  #{searchString?.split('#')?.[searchString?.split('#')?.length - 1] || ''}
                </span>
              </div>
              {suggestions?.map((tag, tagIdx) => (
                <Listbox.Option
                  key={tagIdx}
                  className="py-2 px-3 text-th-primary-medium text-xs w-full text-start hover:bg-th-background-third"
                  value={tag}
                >
                  <span className="block truncate font-normal">{tag.name}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
