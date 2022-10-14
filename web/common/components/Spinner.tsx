import classNames from 'classnames';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <svg
      className={classNames('animate-spin', {
        'h-5 w-5': size === 'sm',
        'h-8 w-8': size === 'md',
        'h-12 w-12': size === 'lg',
        'text-th-primary-medium': !className.includes('text-'),
        className: true,
      })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth={2} stroke="currentColor"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        strokeWidth={1}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
