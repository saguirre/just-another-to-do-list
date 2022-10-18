import classNames from 'classnames';
import { OptionMenuItem } from '../models/option-menu-item';
import { Todo } from '../models/todo';
import { Spinner } from './Spinner';

interface OptionMenuButtonProps {
  option: OptionMenuItem;
  closeSelf: () => void;
  itemAttachedToOptions?: Todo;
}
export const OptionMenuButton: React.FC<OptionMenuButtonProps> = ({ option, itemAttachedToOptions, closeSelf }) => {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        closeSelf();
        option.action(option, itemAttachedToOptions);
      }}
      className={classNames(
        'w-full text-start hover:bg-th-background-third text-xs text-th-primary-medium p-3 flex flex-row items-center options-center justify-start gap-2',
        option.className
      )}
    >
      {itemAttachedToOptions?.beingDeleted && option?.label?.toLowerCase() === 'delete' ? (
        <Spinner size="sm" className="text-rose-400 ml-0" />
      ) : (
        <option.icon className={classNames('h-4 w-4 text-th-primary-medium', option.className)} />
      )}
      {option.label}
    </button>
  );
};
