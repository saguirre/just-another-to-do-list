import { TagIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { useState } from 'react';
import { Tag } from '../models/tag';

interface TagListProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  className?: string;
  hoverable?: boolean;
  size?: 'sm' | 'md';
}
export const TagList: React.FC<TagListProps> = ({ tags, setTags, className, size = 'md', hoverable = true }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className={classNames(
        'flex flex-row w-full flex-wrap items-center justify-start p-2 rounded-b-lg gap-2',
        className
      )}
    >
      {tags.map((tag: Tag) => {
        return (
          <span
            //@ts-ignore
            onClick={() => setTags((current: Tag[]): Tag[] => current.filter((t) => t.id !== tag?.id))}
            key={tag.id}
            onMouseEnter={() => hoverable && setIsHovering(true)}
            onMouseLeave={() => hoverable && setIsHovering(false)}
            style={{ backgroundColor: isHovering ? '#F43F5E' : `#${tag.color}` }}
            className={classNames(
              hoverable ? 'hover:cursor-pointer hover:bg-rose-500' : '',
              'flex flex-row items-center justify-start gap-1.5 w-fit flex-wrap rounded-full px-3 py-1 font-semibold  text-th-primary-extra-light',
              {
                'text-sm': size === 'md',
                'text-xs': size === 'sm',
                'bg-th-accent-dark': !tag?.color?.length,
              }
            )}
          >
            <TagIcon
              className={classNames({
                'h-4 w-4': size === 'md',
                'h-3 w-3': size === 'sm',
              })}
            />
            {tag.name}
          </span>
        );
      })}
    </div>
  );
};
