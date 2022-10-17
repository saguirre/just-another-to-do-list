import classNames from 'classnames';
import { Tag } from '../models/tag';

interface TagListProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  className?: string;
  hoverable?: boolean;
}
export const TagList: React.FC<TagListProps> = ({ tags, setTags, className, hoverable = true }) => {
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
            className={classNames(
              hoverable ? 'hover:cursor-pointer hover:bg-rose-500' : '',
              'inline-block w-fit flex-wrap bg-th-accent-dark rounded-full px-2.5 py-1 font-semibold text-sm text-th-primary-medium'
            )}
          >
            {tag.name}
          </span>
        );
      })}
    </div>
  );
};
