import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';
import { Stepper } from './Stepper';

const onboardingSteps = [
  {
    title: 'Add a task',
    description: 'Fill out the text box at the top of the Home page to add a task to your list.',
  },
  {
    title: 'Edit a task',
    description:
      'Edit, delete, or mark a task as complete by clicking on it. You can also drag and drop tasks to reorder them. ',
  },
  {
    title: 'Create a project',
    description:
      "Create a project to organize your tasks. You can also add a description and a color to your project. You don't need to assign a task to a project if you don't want to, you do you!",
  },
  {
    title: 'Never lose your data',
    description: 'We autosave your data, so you never have to worry about losing it. ',
  },
  {
    title: 'Tailor your experience',
    description:
      'Change your theme easily from the home page, however many times you want, at any time. No need to head over to the settings page!',
  },
  {
    title: "Let's get started!",
    description:
      'You can always access this tutorial from the settings page. Now, go ahead and add a task to your list!',
  },
];
interface OnboardingTutorialProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ open, setOpen }) => {
  const [step, setStep] = useState(0);
  const [hoveringSkip, setHoveringSkip] = useState(false);
  const [skipText, setSkipText] = useState({
    header: 'Did you know skipping the tutorial accounts for 1% of our revenue?',
    subheader: '(You can click me to close btw)',
  });
  return (
    <>
      {open && (
        <div className="relative w-full min-h-[200px] flex flex-col items-center justify-between">
          <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-th-primary-dark">
            {onboardingSteps[step]?.title}
          </Dialog.Title>
          <span className="text-sm text-th-primary-light text-center mb-3 w-[80%]">
            {onboardingSteps[step]?.description}
          </span>
          <div className="w-full">
            <Stepper
              currentStep={step}
              setCurrentStep={(step: number) => setStep(step)}
              onFinish={() => setOpen(false)}
              steps={onboardingSteps}
            />
          </div>
          <button
            onMouseEnter={() => setHoveringSkip(true)}
            onMouseLeave={() => setHoveringSkip(false)}
            onClick={() => {
              setSkipText({ header: 'Alrighty then!', subheader: '' });
              setTimeout(() => setOpen(false), 750);
            }}
            className={classNames(
              'absolute -top-3 -right-3 bg-th-background hover:w-fit text-th-primary-medium text-sm transition-all duration-150',
              {
                'h-6 w-6 rounded-full flex flex-col items-center justify-center': !hoveringSkip,
                'px-4 py-2 rounded-2xl border-b border-th-background shadow-lg bg-th-background-secondary':
                  hoveringSkip,
              }
            )}
          >
            {hoveringSkip ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-th-primary-light">{skipText.header}</span>
                {skipText.subheader && <span className="text-xs text-th-primary-light">{skipText.subheader}</span>}
              </div>
            ) : (
              <XMarkIcon className="text-th-primary-dark" />
            )}
          </button>
        </div>
      )}
    </>
  );
};
