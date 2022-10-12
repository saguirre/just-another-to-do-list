import classNames from 'classnames';
import { OptionMenuItem } from '../models/option-menu-item';
import { Todo } from '../models/todo';

interface OptionMenuButtonProps {
  option: OptionMenuItem;
  itemAttachedToOptions?: Todo;
}
export const OptionMenuButton: React.FC<OptionMenuButtonProps> = ({ option, itemAttachedToOptions }) => {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        option.action(option, itemAttachedToOptions);
      }}
      className={classNames(
        'w-full text-start hover:bg-th-background-third text-xs text-th-primary-medium p-3 flex flex-row items-center options-center justify-start gap-2',
        option.className
      )}
    >
      <option.icon className={classNames('h-4 w-4 text-th-primary-medium', option.className)} />
      {option.label}
    </button>
  );
};
