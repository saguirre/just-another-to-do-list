import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Tag } from '../models/tag';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

interface TagListBoxProps {
  suggestions: Tag[];
  searchString?: string;
  color?: string;
  open: boolean;
}
export const TagListBox: React.FC<TagListBoxProps> = ({ suggestions, searchString, open, color }) => {
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
                <span
                  className={classNames(
                    'inline-block w-fit flex-wrap rounded-full px-2.5 py-1 font-semibold text-sm text-th-primary-extra-light',
                    { 'bg-th-accent-dark': !color?.length }
                  )}
                  style={{ backgroundColor: `#${color}` }}
                >
                  #{searchString?.split('#')?.[searchString?.split('#')?.length - 1] || ''}
                </span>
              </div>
              {suggestions
                ?.filter((tag) =>
                  tag.name
                    ?.toLowerCase()
                    ?.includes(searchString?.split('#')?.[searchString?.split('#')?.length - 1] || '')
                )
                ?.map((tag, tagIdx) => (
                  <Listbox.Option
                    key={tagIdx}
                    className="hover:cursor-pointer py-2 px-3 text-th-primary-medium text-xs w-full text-start hover:bg-th-background-third"
                    value={tag}
                  >
                    <span
                      //@ts-ignore
                      onClick={() => setTags((current: Tag[]): Tag[] => current.filter((t) => t.id !== tag?.id))}
                      key={tag.id}
                      style={{ backgroundColor: `#${tag.color}` }}
                      className={classNames(
                        'inline-block w-fit flex-wrap  rounded-full px-2.5 py-1 font-semibold text-sm text-th-primary-extra-light',
                        {
                          'bg-th-accent-dark': !tag?.color?.length,
                        }
                      )}
                    >
                      {tag.name}
                    </span>
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
