import {
  ChevronRightIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Todo } from '../models/todo';
import { PrioritySpan } from './PrioritySpan';
import { Spinner } from './Spinner';
import { TagList } from './TagList';

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
        'min-h-screen overflow-y-hidden absolute w-screen z-50 md:z-0 bg-th-background left-0 top-80 md:mt-0 md:top-0 border-t md:border-l border-b border-th-accent-medium shadow-2xl shadow-th-primary-dark rounded-t-lg md:rounded-tr-none md:rounded-l-lg md:shadow-none md:relative transition-all duration-300 md:h-full mt-12 md:flex md:flex-col md:space-y-3 md:p-4',
        {
          'md:w-1/2 opacity-100': Object.entries(selectedTask || {}).length > 0,
          'hidden md:w-0 opacity-0': Object.entries(selectedTask || {}).length === 0,
        }
      )}
    >
      <div
        className={classNames('hidden md:flex absolute top-[40%] left-0 transition-all duration-300 z-50', {
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
      <div
        className={classNames(
          'md:hidden transition-all flex flex-col items-center justify-center w-full duration-300 z-50',
          {
            'opacity-100': Object.entries(selectedTask || {}).length > 0,
            'opacity-0': Object.entries(selectedTask || {}).length === 0,
          }
        )}
      >
        <button
          onClick={() => onClose()}
          className="flex flex-col w-16 items-center justify-center mb-3 rounded-b-2xl pt-0.5 pb-1 pl-0.5 hover:bg-th-background-secondary"
        >
          <ChevronDownIcon className="h-6 w-6 text-th-accent-light" />
        </button>
      </div>
      <div className="pl-3 flex flex-row gap-2 items-center justify-start">
        {selectedTask?.todosPriority && (
          <div className="w-fit">
            <PrioritySpan
              hoverable={false}
              selectedPriority={selectedTask?.todosPriority}
              setSelectedPriority={() => {}}
            />
          </div>
        )}
        <TagList hoverable={false} tags={selectedTask?.todoTags?.map(({ tag }) => tag) || []} setTags={() => {}} />
      </div>

      <div className="w-full flex flex-row items-center justify-between pl-4 mb-6">
        <input
          placeholder="Enter a task"
          minLength={1}
          maxLength={100}
          className="text-2xl text-ellipsis text-th-primary-dark outline-none focus:border-b-2 focus:border-th-accent-medium pb-1 w-[85%] bg-th-background placeholder:text-th-primary-dark placeholder:opacity-40"
          onChange={(e) => onInputChange(e.target.value)}
          value={selectedTask?.task || ''}
        />
        <div className="flex flex-row items-center justify-end gap-2">
          <button className="rounded-full pr-4 pl-1 py-1 flex flex-col justify-center items-center">
            {autoSaving && <Spinner size="sm" />}
            {!autoSaving && autoSaved && <CheckIcon className="h-6 w-6 text-th-accent-medium" />}
          </button>
          <button className="hidden hover:bg-th-background-secondary rounded-full p-1 flex-col justify-center items-center">
            <EllipsisHorizontalIcon className="h-5 w-5 text-th-primary-medium" />
          </button>
          <button
            onClick={() => onClose()}
            className="hidden md:flex hover:bg-th-background-secondary rounded-full p-1 flex-col justify-center items-center"
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
