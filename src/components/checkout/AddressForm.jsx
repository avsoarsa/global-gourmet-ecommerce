import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Address form with validation
 * 
 * @param {Object} props - Component props
 * @param {Object} props.address - Initial address data
 * @param {Function} props.onAddressChange - Callback when address changes
 * @param {boolean} props.showValidation - Whether to show validation messages
 */
const AddressForm = ({ address = {}, onAddressChange, showValidation = false }) => {
  const [formData, setFormData] = useState({
    firstName: address.firstName || '',
    lastName: address.lastName || '',
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    country: address.country || 'United States',
    phone: address.phone || ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Update form data when address prop changes
  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'United States',
        phone: address.phone || ''
      });
    }
  }, [address]);
  
  // Validate form data
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : 'This field is required';
      case 'street':
        return value.trim() ? '' : 'Street address is required';
      case 'city':
        return value.trim() ? '' : 'City is required';
      case 'state':
        return value.trim() ? '' : 'State is required';
      case 'zipCode':
        // Basic zip code validation
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!value.trim()) return 'Zip code is required';
        if (!zipRegex.test(value)) return 'Please enter a valid zip code (e.g., 12345 or 12345-6789)';
        return '';
      case 'country':
        return value.trim() ? '' : 'Country is required';
      case 'phone':
        // Basic phone validation
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!value.trim()) return 'Phone number is required';
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return '';
      default:
        return '';
    }
  };
  
  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field if it's been touched
    if (touched[name] || showValidation) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
    
    // Notify parent component
    onAddressChange({
      ...formData,
      [name]: value
    });
  };
  
  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  // Countries list
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'India',
    'China',
    'Brazil'
  ];
  
  // US states list
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.firstName && (touched.firstName || showValidation) ? 'border-red-300' : ''
            }`}
          />
          {errors.firstName && (touched.firstName || showValidation) && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              {errors.firstName}
            </p>
          )}
        </div>
        
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.lastName && (touched.lastName || showValidation) ? 'border-red-300' : ''
            }`}
          />
          {errors.lastName && (touched.lastName || showValidation) && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>
      
      {/* Street Address */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.street && (touched.street || showValidation) ? 'border-red-300' : ''
          }`}
        />
        {errors.street && (touched.street || showValidation) && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            {errors.street}
          </p>
        )}
      </div>
      
      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.city && (touched.city || showValidation) ? 'border-red-300' : ''
          }`}
        />
        {errors.city && (touched.city || showValidation) && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            {errors.city}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State/Province */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State/Province *
          </label>
          {formData.country === 'United States' ? (
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                errors.state && (touched.state || showValidation) ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select a state</option>
              {usStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                errors.state && (touched.state || showValidation) ? 'border-red-300' : ''
              }`}
            />
          )}
          {errors.state && (touched.state || showValidation) && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              {errors.state}
            </p>
          )}
        </div>
        
        {/* Zip/Postal Code */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            Zip/Postal Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.zipCode && (touched.zipCode || showValidation) ? 'border-red-300' : ''
            }`}
          />
          {errors.zipCode && (touched.zipCode || showValidation) && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              {errors.zipCode}
            </p>
          )}
        </div>
      </div>
      
      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.country && (touched.country || showValidation) ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select a country</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.country && (touched.country || showValidation) && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            {errors.country}
          </p>
        )}
      </div>
      
      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.phone && (touched.phone || showValidation) ? 'border-red-300' : ''
          }`}
          placeholder="(123) 456-7890"
        />
        {errors.phone && (touched.phone || showValidation) && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            {errors.phone}
          </p>
        )}
      </div>
      
      {/* Form validation status */}
      {showValidation && Object.keys(errors).length === 0 && (
        <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          Address information is valid
        </div>
      )}
    </div>
  );
};

export default AddressForm;
