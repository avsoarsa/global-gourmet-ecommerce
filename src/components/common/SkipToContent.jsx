import { useEffect, useState } from 'react';

/**
 * SkipToContent component for keyboard navigation
 * Allows keyboard users to skip navigation and go directly to main content
 */
const SkipToContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show the skip link when Tab is pressed
      if (e.key === 'Tab') {
        setIsVisible(true);
        // Remove the event listener after first Tab press
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Find the main content element
    const mainContent = document.getElementById('main-content');
    
    if (mainContent) {
      // Set focus to the main content
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      
      // Remove tabindex after focus to prevent unexpected behavior
      setTimeout(() => {
        mainContent.removeAttribute('tabindex');
      }, 100);
    }
  };
  
  return (
    <a
      href="#main-content"
      className={`skip-to-content ${isVisible ? 'block' : 'hidden'}`}
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
