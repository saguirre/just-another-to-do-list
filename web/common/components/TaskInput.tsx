import classNames from 'classnames';

interface TaskInputProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const TaskInput: React.FC<TaskInputProps> = ({ disabled, placeholder, value, onChange, onKeyDown }) => {
  return (
    <div className="relative w-full flex flex-row items-center justify-between">
      <input
        placeholder={placeholder}
        onKeyDown={(e) => onKeyDown(e)}
        onChange={(e) => onChange(e.target.value)}
        value={value || ''}
        disabled={disabled}
        className={classNames(
          'rounded-md text-base w-full px-3 py-2 focus:ring-th-accent-medium focus:ring-1 focus:outline-none placeholder:text-th-primary-dark placeholder:opacity-30 text-th-primary-medium border border-th-accent-medium bg-th-background',
          {
            'opacity-50': disabled,
          }
        )}
      />
    </div>
  );
};
