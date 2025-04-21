import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCreditCard, 
  faPlus, 
  faTrash, 
  faPencilAlt, 
  faCcVisa, 
  faCcMastercard, 
  faCcAmex, 
  faCcDiscover,
  faShieldAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

/**
 * Component for managing saved payment methods
 */
const SavedPaymentMethods = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState(currentUser?.paymentMethods || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get card type based on card number
  const getCardType = (cardNumber) => {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[ -]/g, '');
    
    // Visa
    if (/^4/.test(cleanNumber)) {
      return { type: 'visa', icon: faCcVisa };
    }
    // Mastercard
    else if (/^5[1-5]/.test(cleanNumber)) {
      return { type: 'mastercard', icon: faCcMastercard };
    }
    // Amex
    else if (/^3[47]/.test(cleanNumber)) {
      return { type: 'amex', icon: faCcAmex };
    }
    // Discover
    else if (/^6(?:011|5)/.test(cleanNumber)) {
      return { type: 'discover', icon: faCcDiscover };
    }
    // Default
    return { type: 'unknown', icon: faCreditCard };
  };
  
  // Format card number with spaces
  const formatCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const cardType = getCardType(cleanNumber).type;
    
    // Format based on card type
    if (cardType === 'amex') {
      // XXXX XXXXXX XXXXX
      return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
    } else {
      // XXXX XXXX XXXX XXXX
      return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
  };
  
  // Mask card number for display
  const maskCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const lastFour = cleanNumber.slice(-4);
    const cardType = getCardType(cleanNumber).type;
    
    if (cardType === 'amex') {
      return `•••• •••••• ${lastFour}`;
    } else {
      return `•••• •••• •••• ${lastFour}`;
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for card number to format it
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // Card number validation
    const cleanCardNumber = formData.cardNumber.replace(/\D/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCardNumber.length < 15 || cleanCardNumber.length > 16) {
      newErrors.cardNumber = 'Card number must be 15-16 digits';
    }
    
    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    // Expiry date validation
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Month is required';
    }
    
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Year is required';
    } else {
      const expiryYear = parseInt(formData.expiryYear);
      const expiryMonth = parseInt(formData.expiryMonth);
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        newErrors.expiryYear = 'Card has expired';
      }
    }
    
    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create new payment method object
    const newPaymentMethod = {
      id: isEditing || Date.now().toString(),
      cardNumber: formData.cardNumber.replace(/\D/g, ''),
      cardholderName: formData.cardholderName,
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      cardType: getCardType(formData.cardNumber).type,
      isDefault: formData.isDefault
    };
    
    let updatedPaymentMethods;
    
    if (isEditing) {
      // Update existing payment method
      updatedPaymentMethods = paymentMethods.map(method => 
        method.id === isEditing ? newPaymentMethod : method
      );
    } else {
      // Add new payment method
      updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
    }
    
    // If this is set as default, update other methods
    if (formData.isDefault) {
      updatedPaymentMethods = updatedPaymentMethods.map(method => ({
        ...method,
        isDefault: method.id === newPaymentMethod.id
      }));
    }
    
    // Update state
    setPaymentMethods(updatedPaymentMethods);
    
    // Update user profile
    updateUserProfile({ paymentMethods: updatedPaymentMethods });
    
    // Reset form
    setFormData({
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    });
    
    // Show success message
    setSuccessMessage(isEditing ? 'Payment method updated successfully' : 'Payment method added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Close form
    setIsAddingNew(false);
    setIsEditing(null);
  };
  
  // Handle edit button click
  const handleEdit = (method) => {
    setIsEditing(method.id);
    setIsAddingNew(true);
    setFormData({
      cardNumber: formatCardNumber(method.cardNumber),
      cardholderName: method.cardholderName,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cvv: '',
      isDefault: method.isDefault
    });
  };
  
  // Handle delete button click
  const handleDelete = (id) => {
    const updatedPaymentMethods = paymentMethods.filter(method => method.id !== id);
    
    // If we're deleting the default method, set the first remaining method as default
    if (paymentMethods.find(method => method.id === id)?.isDefault && updatedPaymentMethods.length > 0) {
      updatedPaymentMethods[0].isDefault = true;
    }
    
    setPaymentMethods(updatedPaymentMethods);
    updateUserProfile({ paymentMethods: updatedPaymentMethods });
    
    // Show success message
    setSuccessMessage('Payment method removed successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Handle set as default
  const handleSetDefault = (id) => {
    const updatedPaymentMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentMethods(updatedPaymentMethods);
    updateUserProfile({ paymentMethods: updatedPaymentMethods });
    
    // Show success message
    setSuccessMessage('Default payment method updated');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Generate years for dropdown
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-green-600" />
          Saved Payment Methods
        </h2>
        
        {!isAddingNew && (
          <button
            onClick={() => {
              setIsAddingNew(true);
              setIsEditing(null);
              setFormData({
                cardNumber: '',
                cardholderName: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                isDefault: paymentMethods.length === 0 // Default if first card
              });
            }}
            className="flex items-center text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Payment Method
          </button>
        )}
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Add/Edit Payment Method Form */}
      {isAddingNew && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {isEditing ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Card Number */}
              <div className="col-span-2">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="19"
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.cardNumber ? 'border-red-300' : ''
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon 
                      icon={getCardType(formData.cardNumber).icon} 
                      className="text-lg" 
                    />
                  </div>
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>
              
              {/* Cardholder Name */}
              <div className="col-span-2">
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="Name as it appears on card"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                    errors.cardholderName ? 'border-red-300' : ''
                  }`}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                )}
              </div>
              
              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                        errors.expiryMonth ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = i + 1;
                        return (
                          <option key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                        errors.expiryYear ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Year</option>
                      {generateYears().map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {(errors.expiryMonth || errors.expiryYear) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expiryMonth || errors.expiryYear}
                  </p>
                )}
              </div>
              
              {/* CVV */}
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                    errors.cvv ? 'border-red-300' : ''
                  }`}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
              
              {/* Default Payment Method */}
              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>
              </div>
            </div>
            
            {/* Security Note */}
            <div className="mb-4 text-xs text-gray-500 flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-1 text-green-600" />
              Your card information is encrypted and stored securely.
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setIsEditing(null);
                  setErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isEditing ? 'Update' : 'Save'} Payment Method
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Payment Methods List */}
      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <div 
              key={method.id} 
              className={`border rounded-lg p-4 ${
                method.isDefault ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={getCardType(method.cardNumber).icon} 
                    className="text-2xl mr-3 text-gray-700" 
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {maskCardNumber(method.cardNumber)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear.toString().slice(-2)}
                    </div>
                    {method.isDefault && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        Default Payment Method
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded px-2 py-1"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(method)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FontAwesomeIcon icon={faCreditCard} className="text-3xl mb-2" />
          <p>No payment methods saved yet.</p>
          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="mt-2 text-green-600 hover:text-green-700 font-medium"
            >
              Add your first payment method
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedPaymentMethods;
