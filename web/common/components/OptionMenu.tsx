import { Popover, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { OptionMenuItem } from '../models/option-menu-item';
import { Todo } from '../models/todo';
import { OptionMenuButton } from './OptionMenuButton';
import { status } from '@prisma/client';
import { useRef } from 'react';

interface OptionMenuProps {
  options: OptionMenuItem[];
  itemAttachedToOptions?: Todo;
}

export const OptionMenu: React.FC<OptionMenuProps> = ({ options, itemAttachedToOptions }) => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Popover className="absolute right-2 top-2 z-10">
      {({ open }) => (
        <>
          <Popover.Button
            ref={ref}
            className={classNames(
              'hover:bg-th-background-secondary rounded-full p-1 flex flex-col justify-center items-center transition-all',
              {
                'opacity-50 duration-500': itemAttachedToOptions?.status === status.COMPLETED,
                'opacity-50 hover:bg-th-background': itemAttachedToOptions?.deleted,
                'scale-y-0 opacity-0 duration-700':
                  itemAttachedToOptions?.beingDeleted || itemAttachedToOptions?.beingRevived,
                'translate-x-0 opacity-100 duration-500':
                  !itemAttachedToOptions?.beingSlashed && itemAttachedToOptions?.status === status.TODO,
              }
            )}
          >
            <EllipsisHorizontalIcon className="h-5 w-5 text-th-primary-medium" />
          </Popover.Button>
          <Transition
            as="div"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute -left-[75px] z-10 mt-1 ring-[0.5px] ring-th-accent-medium outline-none w-40 h-fit bg-th-background-secondary -translate-x-1/2 transform rounded-lg">
              {options.map((option: OptionMenuItem, index: number) => (
                <OptionMenuButton
                  closeSelf={() => ref.current?.click()}
                  key={option.label + index}
                  itemAttachedToOptions={itemAttachedToOptions}
                  option={
                    index === 0
                      ? { ...option, className: option.className + ' rounded-t-lg' }
                      : index === options.length - 1
                      ? { ...option, className: option.className + ' rounded-b-lg' }
                      : option
                  }
                />
              ))}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
