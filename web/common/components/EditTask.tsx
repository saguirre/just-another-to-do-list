import { ChevronRightIcon, CheckIcon, EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Todo } from '../models/todo';
import { Spinner } from './Spinner';

interface EditTaskProps {
  onClose: () => void;
  selectedTask?: Todo;
  onInputChange: (value: string) => void;
  onTextAreaChange: (value: string) => void;
  autoSaving: boolean;
  autoSaved: boolean;
}

export const EditTask: React.FC<EditTaskProps> = ({
  onClose,
  selectedTask,
  onInputChange,
  onTextAreaChange,
  autoSaved,
  autoSaving,
}) => {
  return (
    <div
      className={classNames(
        'min-h-screen relative transition-all duration-300 h-full mt-12 flex flex-col space-y-3 p-4',
        {
          'w-1/2 opacity-100': Object.entries(selectedTask || {}).length > 0,
          'w-0 opacity-0': Object.entries(selectedTask || {}).length === 0,
        }
      )}
    >
      <div
        className={classNames('absolute top-[40%] left-0 transition-all duration-300 z-50', {
          'opacity-100': Object.entries(selectedTask || {}).length > 0,
          'opacity-0': Object.entries(selectedTask || {}).length === 0,
        })}
      >
        <button
          onClick={() => onClose()}
          className="flex flex-col items-center justify-center h-16 m-0 rounded-r-2xl pt-0.5 pb-1 pl-0.5 hover:bg-th-background-secondary"
        >
          <ChevronRightIcon className="h-6 w-6 text-th-accent-light" />
        </button>
      </div>
      <div className="w-full flex flex-row items-center justify-between pl-4">
        <input
          placeholder="Enter a task"
          minLength={1}
          maxLength={100}
          className="text-2xl text-ellipsis text-th-primary-dark outline-none focus:border-b-2 focus:border-th-accent-medium pb-1 w-[85%] bg-th-background placeholder:text-th-primary-dark placeholder:opacity-40"
          onChange={(e) => onInputChange(e.target.value)}
          value={selectedTask?.task || ''}
        />
        <div className="flex flex-row items-center justify-end gap-2">
          <button className="rounded-full p-1 flex flex-col justify-center items-center">
            {autoSaving && <Spinner size="sm" />}
            {!autoSaving && autoSaved && <CheckIcon className="h-6 w-6 text-th-accent-medium" />}
          </button>
          <button className="hover:bg-th-background-secondary rounded-full p-1 flex flex-col justify-center items-center">
            <EllipsisHorizontalIcon className="h-5 w-5 text-th-primary-medium" />
          </button>
          <button
            onClick={() => onClose()}
            className="hover:bg-th-background-secondary rounded-full p-1 flex flex-col justify-center items-center"
          >
            <XMarkIcon className="h-5 w-5 text-th-primary-medium" />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-row items-start justify-start px-4">
        <textarea
          onChange={(e) => onTextAreaChange(e.target.value)}
          value={selectedTask?.description || ''}
          placeholder="Task description"
          rows={30}
          className="bg-th-background p-0 w-full h-[90%] focus:border-transparent focus:ring-0 resize-none border-transparent outline-none text-sm text-th-primary-medium placeholder:text-th-primary-medium placeholder:opacity-40"
        ></textarea>
      </div>
    </div>
  );
};
