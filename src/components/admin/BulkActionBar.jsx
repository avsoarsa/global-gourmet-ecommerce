import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faEdit,
  faCheckCircle,
  faTimes,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationDialog from '../common/ConfirmationDialog';

const BulkActionBar = ({
  selectedItems,
  onClearSelection,
  onDelete,
  onEdit,
  customActions = [],
  itemName = 'item',
  className = ''
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Toggle actions dropdown
  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  // Handle bulk delete
  const handleDelete = () => {
    setShowConfirmDelete(true);
    setIsActionsOpen(false);
  };

  // Confirm bulk delete
  const confirmDelete = () => {
    onDelete(selectedItems);
    setShowConfirmDelete(false);
  };

  // Cancel bulk delete
  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  // Handle bulk edit
  const handleEdit = () => {
    onEdit(selectedItems);
    setIsActionsOpen(false);
  };

  // Handle custom action
  const handleCustomAction = (action) => {
    action.handler(selectedItems);
    setIsActionsOpen(false);
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {selectedItems.length} {itemName}{selectedItems.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onClearSelection}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Clear
          </button>

          <div className="relative">
            <button
              onClick={toggleActions}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Actions
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>

            {isActionsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                      role="menuitem"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-3 text-blue-600" />
                      Edit Selected
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                      role="menuitem"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-3 text-red-600" />
                      Delete Selected
                    </button>
                  )}

                  {customActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleCustomAction(action)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                      role="menuitem"
                    >
                      {action.icon && (
                        <FontAwesomeIcon icon={action.icon} className={`mr-3 ${action.iconClass || 'text-gray-600'}`} />
                      )}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Selected Items"
        message={`Are you sure you want to delete ${selectedItems.length} ${itemName}${selectedItems.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        icon={faTrash}
      />
    </div>
  );
};

export default BulkActionBar;
