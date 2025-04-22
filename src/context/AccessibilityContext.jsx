import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AccessibilityContext = createContext();

/**
 * Provider component for accessibility settings
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AccessibilityProvider = ({ children }) => {
  // State for various accessibility settings
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(true);
  
  // Check for user's system preferences on mount
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setReducedMotion(true);
    }
    
    // Listen for changes in reduced motion preference
    const handleReducedMotionChange = (e) => {
      setReducedMotion(e.matches);
    };
    
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    
    // Check for keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
        setFocusVisible(true);
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
    
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-user');
      window.addEventListener('keydown', handleKeyDown);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    // Load saved preferences from localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedLargeText = localStorage.getItem('largeText') === 'true';
    
    if (savedHighContrast) setHighContrast(true);
    if (savedLargeText) setLargeText(true);
    
    // Apply initial settings to document
    applyAccessibilitySettings(savedHighContrast, savedLargeText, reducedMotion);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  // Apply settings to document when they change
  useEffect(() => {
    applyAccessibilitySettings(highContrast, largeText, reducedMotion);
    
    // Save preferences to localStorage
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('largeText', largeText);
  }, [highContrast, largeText, reducedMotion]);
  
  // Helper function to apply settings
  const applyAccessibilitySettings = (highContrast, largeText, reducedMotion) => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply large text
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };
  
  // Toggle functions
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);
  const toggleFocusVisible = () => setFocusVisible(prev => !prev);
  
  // Context value
  const value = {
    highContrast,
    largeText,
    reducedMotion,
    focusVisible,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleFocusVisible
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
