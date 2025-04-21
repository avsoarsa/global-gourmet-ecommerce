import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCreditCard,
  faClipboardCheck,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const CheckoutProgress = ({ currentStep, steps }) => {
  const { t } = useTranslation();
  
  // Define the steps and their properties
  const stepsConfig = [
    {
      key: steps.SHIPPING,
      label: t('checkout.shippingAddress'),
      icon: faMapMarkerAlt
    },
    {
      key: steps.PAYMENT,
      label: t('checkout.paymentMethod'),
      icon: faCreditCard
    },
    {
      key: steps.REVIEW,
      label: t('checkout.reviewOrder'),
      icon: faClipboardCheck
    },
    {
      key: steps.CONFIRMATION,
      label: t('checkout.confirmation'),
      icon: faCheckCircle
    }
  ];
  
  // Find the current step index
  const currentStepIndex = stepsConfig.findIndex(step => step.key === currentStep);
  
  return (
    <div className="mb-8">
      <div className="hidden md:block">
        {/* Desktop Progress Bar */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (stepsConfig.length - 1)) * 100}%` }}
          ></div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {stepsConfig.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                      isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <FontAwesomeIcon icon={faCheckCircle} />
                    ) : (
                      <FontAwesomeIcon icon={step.icon} />
                    )}
                  </div>
                  <div 
                    className={`mt-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
            >
              <FontAwesomeIcon icon={stepsConfig[currentStepIndex].icon} />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">
                {t('checkout.step')} {currentStepIndex + 1} {t('checkout.of')} {stepsConfig.length}
              </div>
              <div className="text-lg font-medium text-gray-900">
                {stepsConfig[currentStepIndex].label}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / stepsConfig.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
