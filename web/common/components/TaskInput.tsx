import classNames from 'classnames';
import { useState } from 'react';
import { Tag } from '../models/tag';
import { TagList } from './TagList';
import { TagListBox } from './TagListBox';

interface TaskInputProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  tags: Tag[];
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
  placeholder,
  value,
  onChange,
  onKeyDown,
}) => {
  const [tagDropdownVisible, setTagDropdownVisible] = useState<boolean>(false);
  const TAG_DELIMITER = [',', ' ', ';', 'Enter', 'Tab'];
  const TAG_INDICATOR = '#';

  const internalOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === TAG_INDICATOR) {
      setTagDropdownVisible(!tagDropdownVisible);
      return;
    } else if (event.key === 'Backspace' && value?.endsWith('#')) {
      setTagDropdownVisible(false);
    } else if (tagDropdownVisible && value?.includes('#') && TAG_DELIMITER.includes(event.key)) {
      setTagDropdownVisible(false);
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
        <input
          placeholder={placeholder}
          onKeyDown={(e) => internalOnKeyDown(e)}
          onChange={(e) => internalOnChange(e)}
          value={value || ''}
          className="w-full bg-transparent outline-none h-6"
          style={{ paddingLeft: 0 }}
          disabled={disabled}
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
