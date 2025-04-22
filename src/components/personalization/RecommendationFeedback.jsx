import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, 
  faThumbsDown, 
  faTimes, 
  faCheck,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { recordRecommendationFeedback } from '../../utils/personalizationUtils';

/**
 * Component for collecting user feedback on personalized recommendations
 */
const RecommendationFeedback = ({ 
  sectionId, 
  productId, 
  onFeedbackGiven = () => {},
  compact = false,
  className = ''
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle feedback submission
  const handleFeedback = (isRelevant) => {
    // Record feedback
    recordRecommendationFeedback(sectionId, productId, isRelevant);
    
    // Update state
    setFeedbackGiven(true);
    setFeedbackValue(isRelevant);
    setShowThankYou(true);
    
    // Hide thank you message after 2 seconds
    setTimeout(() => {
      setShowThankYou(false);
    }, 2000);
    
    // Call callback
    onFeedbackGiven(isRelevant);
  };
  
  // Compact version (just icons)
  if (compact) {
    if (showThankYou) {
      return (
        <div className={`text-green-600 text-xs flex items-center ${className}`}>
          <FontAwesomeIcon icon={faCheck} className="mr-1" />
          <span>Thanks!</span>
        </div>
      );
    }
    
    if (feedbackGiven) {
      return null;
    }
    
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <button
          onClick={() => handleFeedback(true)}
          className="text-gray-400 hover:text-green-600 transition-colors p-1"
          aria-label="This recommendation is relevant"
          title="This recommendation is relevant"
        >
          <FontAwesomeIcon icon={faThumbsUp} className="text-xs" />
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          aria-label="This recommendation is not relevant"
          title="This recommendation is not relevant"
        >
          <FontAwesomeIcon icon={faThumbsDown} className="text-xs" />
        </button>
      </div>
    );
  }
  
  // Full version
  return (
    <div className={`${className}`}>
      {showThankYou ? (
        <div className="text-green-600 text-sm flex items-center">
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          <span>Thank you for your feedback!</span>
        </div>
      ) : feedbackGiven ? (
        <div className="text-gray-500 text-sm flex items-center">
          <FontAwesomeIcon 
            icon={feedbackValue ? faThumbsUp : faThumbsDown} 
            className={`mr-2 ${feedbackValue ? 'text-green-600' : 'text-red-600'}`} 
          />
          <span>Feedback recorded</span>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-gray-600 mr-2"
              aria-label="What is this?"
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="text-sm" />
            </button>
            
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white shadow-lg rounded-md p-2 text-xs text-gray-700 z-10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">About this recommendation</span>
                  <button 
                    onClick={() => setShowTooltip(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p>Your feedback helps us improve our recommendations for you.</p>
              </div>
            )}
          </div>
          
          <span className="text-sm text-gray-600 mr-2">Is this recommendation relevant to you?</span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
              aria-label="This recommendation is relevant"
            >
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
              aria-label="This recommendation is not relevant"
            >
              <FontAwesomeIcon icon={faThumbsDown} className="mr-1" />
              <span>No</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationFeedback;
