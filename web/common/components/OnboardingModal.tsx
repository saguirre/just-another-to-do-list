import { Dialog, Transition } from '@headlessui/react';
import { EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';
import { Confetti } from './Confetti';
import { ModalWrapper } from './ModalWrapper';
import { OnboardingTutorial } from './OnboardingTutorial';

interface OnboardingModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, setOpen }) => {
  const [openEnvelope, setOpenEnvelope] = useState(false);
  const [agreedToTutorial, setAgreedToTutorial] = useState(false);

  return (
    <ModalWrapper open={open} setOpen={() => {}}>
      <Dialog.Panel
        className={classNames(
          'relative w-fit h-full bg-th-background overflow-y-show rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6',
          {
            'min-h-[200px]': openEnvelope,
          }
        )}
      >
        {agreedToTutorial && <OnboardingTutorial open={open} setOpen={setOpen} />}
        {!agreedToTutorial && (
          <div>
            <button
              onClick={() => {
                setOpenEnvelope(true);
              }}
              className={classNames(
                'relative mx-auto flex items-center pt-1.5 justify-center h-12 w-12 rounded-full bg-th-accent-extra-light focus:outline-none focus:ring-0 transition-all duration-300',
                {
                  'hover:scale-110': !openEnvelope,
                }
              )}
            >
              <EnvelopeIcon
                className={classNames('h-8 w-8 text-th-accent-dark', {
                  'animate-bounce': !openEnvelope,
                  'opacity-0 hidden': openEnvelope,
                })}
                aria-hidden="true"
              />
              <Transition
                as="div"
                className="absolute w-full h-fit inset-y-1.5 flex flex-col items-center justify-center"
                show={openEnvelope}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
              >
                <EnvelopeOpenIcon className="h-8 w-8 text-th-accent-dark " aria-hidden="true" />
                <div className="relative flex flex-col items-center justify-center w-screen h-full">
                  <Confetti shouldFire={openEnvelope} />
                </div>
              </Transition>
            </button>
            <div className="mt-3 text-center sm:mt-3">
              <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-th-primary-dark">
                {!openEnvelope ? 'Welcome!' : 'Hurray!'}
              </Dialog.Title>
              {!openEnvelope && (
                <div className="mt-2 text-th-primary-light text-sm">Psst... Click on the envelope to get started!</div>
              )}
              {openEnvelope && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-th-primary-light">
                    Now that we've moved past that very necessary hurdle... We've prepped a few things for you to get
                    started.
                  </p>
                  <div className="text-th-primary-light text-xs">
                    (Or if you're down for some investigation, you can totally skip the tutorial)
                  </div>
                </div>
              )}
            </div>
            <Transition
              as="div"
              className="w-full h-fit flex flex-col items-center justify-center mt-3 rounded-lg "
              show={openEnvelope}
              enter="transition ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-500"
              leaveFrom="opacity-100"
            >
              <div className="flex w-full flex-row items-center justify-end gap-2 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-th-background hover:bg-th-background-secondary border border-th-accent-dark px-4 py-2 text-th-primary-medium text-sm rounded-md"
                >
                  Skip
                </button>
                <button
                  onClick={() => setAgreedToTutorial(true)}
                  className="bg-th-accent-dark hover:bg-th-accent-medium border border-th-accent-dark px-4 py-2 text-th-primary-extra-light text-sm rounded-md"
                >
                  Get Started
                </button>
              </div>
            </Transition>
          </div>
        )}
      </Dialog.Panel>
    </ModalWrapper>
  );
};
