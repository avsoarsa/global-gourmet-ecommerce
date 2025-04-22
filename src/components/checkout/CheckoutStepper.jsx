import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

/**
 * CheckoutStepper component for multi-step checkout process
 *
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current active step (1-based)
 * @param {Array} props.steps - Array of step objects with name and optional description
 * @param {Function} props.onStepClick - Optional callback when a step is clicked
 */
const CheckoutStepper = ({ currentStep, steps, onStepClick }) => {
  const [animatedStep, setAnimatedStep] = useState(currentStep);

  // Animate progress when step changes
  useEffect(() => {
    if (currentStep !== animatedStep) {
      // Small delay for animation effect
      const timer = setTimeout(() => {
        setAnimatedStep(currentStep);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentStep, animatedStep]);

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-4">
      {/* Progress bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-in-out"
          ></div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={step.name}
                className="flex flex-col items-center"
                onClick={() => {
                  if (onStepClick && (isCompleted || stepNumber === currentStep)) {
                    onStepClick(stepNumber);
                  }
                }}
              >
                <div
                  className={`
                    flex items-center justify-center w-6 h-6 rounded-full
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'bg-green-500 text-white' : ''}
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                    ${onStepClick && (isCompleted || stepNumber === currentStep) ? 'cursor-pointer hover:shadow-md' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div className="text-xs mt-1 font-medium text-center w-full">
                  <div className={`
                    ${isActive ? 'text-green-600 font-semibold' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                  `}>
                    {step.name}
                  </div>
                  {step.description && (
                    <div className="text-gray-400 text-xs text-center whitespace-normal w-20 mx-auto">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting lines */}
        <div className="absolute top-1 left-0 right-0 flex justify-between px-4 -z-10">
          {steps.slice(0, -1).map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
