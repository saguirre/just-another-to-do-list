import { Listbox, Transition } from '@headlessui/react';
import { todoPriority } from '@prisma/client';
import { forwardRef } from 'react';
import { Fragment } from 'react';

interface PriorityListBoxProps {
  suggestions: todoPriority[];
  setSelectedPriority: (priority: todoPriority) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}
export const PriorityListBox: React.FC<PriorityListBoxProps> = forwardRef<HTMLDivElement, PriorityListBoxProps>(
  ({ open, suggestions, setSelectedPriority, setOpen }, ref) => {
    return (
      <div ref={ref} className="absolute top-10 z-20 w-72">
        <Listbox>
          <div className="relative mt-1">
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute mt-1 max-h-60 w-fit break-all overflow-auto rounded-md bg-th-background-secondary py-1 text-base shadow-lg ring-1 ring-bg-th-accent-dark ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {suggestions?.map((priority, priorityIdx) => (
                  <Listbox.Option
                    onClick={() => {
                      setSelectedPriority(priority);
                      setOpen(false);
                    }}
                    key={priorityIdx}
                    className="py-2 px-3 text-th-primary-medium text-xs w-full text-start hover:bg-th-background-third"
                    value={priority}
                  >
                    <span className="block truncate font-normal">{priority.name}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    );
  }
);
