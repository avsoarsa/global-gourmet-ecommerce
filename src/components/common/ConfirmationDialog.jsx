import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faCheck, 
  faTimes,
  faTrash,
  faEdit,
  faArchive
} from '@fortawesome/free-solid-svg-icons';

/**
 * A reusable confirmation dialog component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when the dialog is closed
 * @param {Function} props.onConfirm - Function to call when the action is confirmed
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {string} props.type - Dialog type (warning, danger, info, success)
 * @param {string} props.icon - Icon to display (uses FontAwesome)
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  icon = null
}) => {
  const dialogRef = useRef(null);
  
  // Handle keyboard events (Escape to close, Enter to confirm)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        onConfirm();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);
  
  // Focus the dialog when it opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);
  
  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Determine styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: icon || faTrash,
          iconClass: 'text-red-600',
          bgClass: 'bg-red-50',
          borderClass: 'border-red-300',
          confirmBtnClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'warning':
        return {
          icon: icon || faExclamationTriangle,
          iconClass: 'text-yellow-600',
          bgClass: 'bg-yellow-50',
          borderClass: 'border-yellow-300',
          confirmBtnClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
      case 'success':
        return {
          icon: icon || faCheck,
          iconClass: 'text-green-600',
          bgClass: 'bg-green-50',
          borderClass: 'border-green-300',
          confirmBtnClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        };
      case 'info':
      default:
        return {
          icon: icon || faEdit,
          iconClass: 'text-blue-600',
          bgClass: 'bg-blue-50',
          borderClass: 'border-blue-300',
          confirmBtnClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby={title} role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        {/* Center dialog */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Dialog content */}
        <div 
          ref={dialogRef}
          className={`inline-block align-bottom ${styles.bgClass} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${styles.borderClass} border`}
          tabIndex="-1"
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.bgClass} sm:mx-0 sm:h-10 sm:w-10`}>
                <FontAwesomeIcon icon={styles.icon} className={`h-6 w-6 ${styles.iconClass}`} aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${styles.confirmBtnClass} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
