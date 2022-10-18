import { todoPriority } from '@prisma/client';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Tag } from '../models/tag';
import { PriorityListBox } from './PriorityListBox';
import { PrioritySpan } from './PrioritySpan';
import { TagList } from './TagList';
import { TagListBox } from './TagListBox';
import { useTranslation } from 'next-i18next';

interface TaskInputProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  tags: Tag[];
  selectedPriority?: todoPriority;
  setSelectedPriority: (priority?: todoPriority) => void;
  setTags: (tags: Tag[]) => void;
  suggestions: Tag[];
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  disabled,
  tags,
  setTags,
  suggestions,
  selectedPriority,
  setSelectedPriority,
  placeholder,
  value,
  onChange,
  onKeyDown,
}) => {
  const { t } = useTranslation('common');
  const [tagDropdownVisible, setTagDropdownVisible] = useState<boolean>(false);
  const [priorityDropdownVisible, setPriorityDropdownVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [priorities, setPriorities] = useState<todoPriority[]>([
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' },
    { id: 4, name: 'None' },
  ]);
  const TAG_DELIMITER = [',', ' ', ';', 'Enter', 'Tab'];
  const PRIORITY_DELIMITER = [',', ' ', ';', 'Enter', 'Tab'];
  const TAG_INDICATOR = '#';
  const PRIORITY_INDICATOR = '!';

  const handleValueExtract = () => {
    const splitVal = value?.split('!');
    if (
      splitVal &&
      splitVal?.[splitVal?.length - 1]?.length > 0 &&
      selectedPriority?.name?.toLowerCase() !== splitVal?.[splitVal?.length - 1]?.toLowerCase()
    ) {
      const priority = priorities.find((priority) =>
        priority.name.toLowerCase()?.includes(splitVal?.[splitVal?.length - 1]?.toLowerCase())
      ) || { id: 4, name: t('priorities.none') };
      if (priority) {
        setSelectedPriority(priority);
      }
      return splitVal?.[0];
    } else if (splitVal && splitVal?.[0]?.length === 0) {
      return '';
    }
    return null;
  };

  const internalOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === TAG_INDICATOR) {
      setTagDropdownVisible(!tagDropdownVisible);
      return;
    } else if (event.key === PRIORITY_INDICATOR) {
      setPriorityDropdownVisible(!priorityDropdownVisible);
      return;
    } else if (event.key === 'Backspace' && value?.endsWith('#')) {
      setTagDropdownVisible(false);
      setPriorityDropdownVisible(false);
    } else if (event.key === 'Backspace' && (value?.endsWith('!') || value?.length === 0) && selectedPriority) {
      setTagDropdownVisible(false);
      setPriorityDropdownVisible(false);
      setSelectedPriority({ id: 4, name: t('priorities.none') });
    } else if (priorityDropdownVisible && value?.includes('!') && PRIORITY_DELIMITER.includes(event.key)) {
      setPriorityDropdownVisible(false);
      event.preventDefault();
      event.stopPropagation();
      const newValue = handleValueExtract();
      if (newValue !== null) {
        onChange(newValue || '');
      }
      return;
    } else if (tagDropdownVisible && value?.includes('#') && TAG_DELIMITER.includes(event.key)) {
      setTagDropdownVisible(false);
      event.preventDefault();
      event.stopPropagation();
      const splitVal = value?.split('#');
      if (
        splitVal?.[splitVal?.length - 1]?.length > 0 &&
        !tags.some((tag) => tag.name?.toLowerCase() === splitVal?.[splitVal.length - 1]?.toLowerCase())
      ) {
        setTags([...tags, { id: tags.length + 1, name: splitVal?.[splitVal?.length - 1] || '' }]);
        onChange(splitVal?.[0] || '');
      }
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setTagDropdownVisible(false);
      return;
    }

    onKeyDown(event);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setTagDropdownVisible(false);
        setPriorityDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (priorityDropdownVisible) {
    }
  }, [priorityDropdownVisible]);

  const internalOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <div className="flex flex-col items-start">
      <div
        className={classNames(
          'relative flex flex-row items-center h-full justify-start gap-2 text-base w-full px-3 py-2 focus:ring-th-accent-medium focus:ring-1 focus:outline-none placeholder:text-th-primary-dark placeholder:opacity-30 text-th-primary-medium border border-th-accent-medium bg-th-background',
          {
            'opacity-50': disabled,
            'rounded-t-lg': tags?.length > 0,
            'rounded-lg': tags?.length === 0,
          }
        )}
      >
        {selectedPriority && (
          <PrioritySpan selectedPriority={selectedPriority} setSelectedPriority={setSelectedPriority} />
        )}
        <input
          placeholder={placeholder}
          onKeyDown={(e) => internalOnKeyDown(e)}
          onChange={(e) => internalOnChange(e)}
          value={value || ''}
          className="w-full placeholder:text-sm bg-transparent outline-none h-6 text-ellipsis"
          style={{ paddingLeft: 0 }}
          disabled={disabled}
        />

        <PriorityListBox
          //@ts-ignore
          ref={dropdownRef}
          setOpen={setPriorityDropdownVisible}
          setSelectedPriority={(priority: todoPriority) => {
            const newValue = handleValueExtract();
            if (newValue !== null) {
              onChange(newValue || '');
            }
            setSelectedPriority(priority);
          }}
          open={priorityDropdownVisible && !!value && value?.length > 0 && value.includes('!')}
          suggestions={priorities}
        />
        <TagListBox
          suggestions={suggestions}
          searchString={value}
          open={tagDropdownVisible && !!value && value?.length > 0 && value.includes('#')}
        />
      </div>
      {tags && tags?.length > 0 && <TagList className="bg-th-background-secondary" tags={tags} setTags={setTags} />}
    </div>
  );
};
