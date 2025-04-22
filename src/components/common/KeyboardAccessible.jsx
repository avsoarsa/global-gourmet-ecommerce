import { useEffect, useRef } from 'react';

/**
 * A component that adds keyboard accessibility to any element
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element to make keyboard accessible
 * @param {Function} props.onClick - The function to call when the element is clicked or activated via keyboard
 * @param {string} props.role - The ARIA role of the element (default: 'button')
 * @param {boolean} props.tabIndex - The tabIndex of the element (default: 0)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.ariaProps - Additional ARIA attributes
 */
const KeyboardAccessible = ({
  children,
  onClick,
  role = 'button',
  tabIndex = 0,
  className = '',
  ariaProps = {},
  ...rest
}) => {
  const elementRef = useRef(null);

  // Handle keyboard events
  const handleKeyDown = (e) => {
    // Activate on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  // Focus management
  useEffect(() => {
    const element = elementRef.current;
    
    // Add visual focus indicator styles
    const handleFocus = () => {
      if (element) {
        element.classList.add('keyboard-focus');
      }
    };
    
    const handleBlur = () => {
      if (element) {
        element.classList.remove('keyboard-focus');
      }
    };
    
    // Track if mouse is being used
    const handleMouseDown = () => {
      if (element) {
        element.classList.add('mouse-focus');
      }
    };
    
    const handleMouseUp = () => {
      if (element) {
        element.classList.remove('mouse-focus');
      }
    };
    
    if (element) {
      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`keyboard-accessible ${className}`}
      {...ariaProps}
      {...rest}
    >
      {children}
    </div>
  );
};

export default KeyboardAccessible;
