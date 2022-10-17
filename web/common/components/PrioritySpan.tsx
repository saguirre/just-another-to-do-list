import { todoPriority } from '@prisma/client';
import classNames from 'classnames';

const priorityClass = (priority?: todoPriority) => {
  switch (priority?.name) {
    case 'Low':
      return 'font-bold text-sm rounded-md py-1 px-2 bg-green-400/30 text-green-500';
    case 'Medium':
      return 'font-bold text-sm rounded-md py-1 px-2 bg-yellow-400/30 text-yellow-500';
    case 'High':
      return 'font-bold text-sm rounded-md py-1 px-2 bg-red-400/30 text-red-500';
    default:
      return 'hidden';
  }
};

interface PrioritySpanProps {
  setSelectedPriority: (priority?: todoPriority) => void;
  hoverable?: boolean;
  selectedPriority?: todoPriority;
}
export const PrioritySpan: React.FC<PrioritySpanProps> = ({
  selectedPriority,
  setSelectedPriority,
  hoverable = true,
}) => {
  return (
    <span
      onClick={() => setSelectedPriority({ id: 4, name: 'None' })}
      className={classNames(
        hoverable ? 'hover:cursor-pointer hover:bg-rose-500 hover:text-th-primary-medium' : '',
        priorityClass(selectedPriority)
      )}
    >
      {selectedPriority?.name}
    </span>
  );
};
