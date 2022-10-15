import classNames from 'classnames';

interface StepperProps {
  currentStep: number;
  onFinish: () => void;
  setCurrentStep: (step: number) => void;
  steps: any[];
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, setCurrentStep, steps, onFinish }) => {
  return (
    <nav className="flex flex-row items-center justify-between w-full" aria-label="Progress">
      <ol role="list" className="ml-2 md:ml-8 flex items-center space-x-5">
        {steps.map((step, index) => (
          <li key={step.name}>
            {currentStep > index ? (
              <button
                onClick={() => setCurrentStep(index)}
                className="block w-2.5 h-2.5 bg-th-accent-medium rounded-full hover:bg-th-accent-medium"
              >
                <span className="sr-only">{step.title}</span>
              </button>
            ) : currentStep === index ? (
              <button
                onClick={() => setCurrentStep(index)}
                className="relative flex items-center justify-center"
                aria-current="step"
              >
                <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                  <span className="w-full h-full rounded-full bg-th-accent-extra-light" />
                </span>
                <span className="relative block w-2.5 h-2.5 bg-th-accent-medium rounded-full" aria-hidden="true" />
                <span className="sr-only">{step.title}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(index)}
                className="block w-2.5 h-2.5 bg-th-accent-extra-light rounded-full hover:bg-th-accent-medium"
              >
                <span className="sr-only">{step.title}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
      <div className="relative flex flex-row items-center justify-end gap-2">
        <button
          onClick={() => setCurrentStep(currentStep > 0 ? currentStep - 1 : 0)}
          className={classNames(
            'bg-th-background hover:bg-th-background-secondary border border-th-accent-dark px-4 py-2 text-th-primary-medium text-sm rounded-md',
            {
              'opacity-50 cursor-not-allowed': currentStep === 0,
            }
          )}
        >
          Prev
        </button>
        <button
          onClick={() =>
            currentStep < steps?.length - 1
              ? setCurrentStep(currentStep < steps?.length - 1 ? currentStep + 1 : currentStep)
              : onFinish()
          }
          className="bg-th-accent-dark hover:bg-th-accent-medium border border-th-accent-dark px-4 py-2 text-th-primary-extra-light text-sm rounded-md"
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </nav>
  );
};
