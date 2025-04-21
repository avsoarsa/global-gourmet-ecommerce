import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faCheckCircle,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';

const AddressCard = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className={`border rounded-lg p-4 transition-all ${
        isSelected 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          {isSelected && (
            <div className="text-green-600 font-medium text-sm mb-2 flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              {t('checkout.selectedAddress')}
            </div>
          )}
          
          <h3 className="font-medium text-gray-900">
            {address.firstName} {address.lastName}
          </h3>
          
          <div className="mt-1 text-sm text-gray-600">
            <div>{address.street}</div>
            <div>
              {address.city}, {address.state} {address.zipCode}
            </div>
            <div>{address.country}</div>
            <div className="mt-1">{address.phone}</div>
          </div>
          
          {address.isDefault && (
            <div className="mt-2">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                {t('account.defaultAddress')}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onSelect(address)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isSelected 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isSelected ? t('checkout.selected') : t('checkout.select')}
          </button>
          
          <button
            onClick={() => onEdit(address)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            {t('common.edit')}
          </button>
          
          <button
            onClick={() => onDelete(address)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1" />
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressForm = ({ address = {}, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false,
    ...address
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {address.id ? t('account.editAddress') : t('account.addAddress')}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.firstName')} *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="form-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.lastName')} *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="form-input w-full"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            {t('checkout.streetAddress')} *
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            className="form-input w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              {t('checkout.city')} *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="form-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              {t('checkout.state')} *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="form-input w-full"
            />
          </div>
          
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              {t('checkout.zipCode')} *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="form-input w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              {t('checkout.country')} *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="form-select w-full"
            >
              <option value="">{t('checkout.selectCountry')}</option>
              <option value="United States">{t('regions.unitedStates')}</option>
              <option value="Canada">{t('regions.canada')}</option>
              <option value="United Kingdom">{t('regions.unitedKingdom')}</option>
              <option value="Australia">{t('regions.australia')}</option>
              <option value="Germany">{t('regions.germany')}</option>
              <option value="France">{t('regions.france')}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.phone')} *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="form-input w-full"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-green-600"
            />
            <span className="ml-2 text-sm text-gray-700">
              {t('account.setAsDefault')}
            </span>
          </label>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            {t('common.cancel')}
          </button>
          
          <button
            type="submit"
            className="btn-primary"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

const ShippingStep = ({ onNext, shippingAddress, setShippingAddress }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { getShippingOptions } = useRegion();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // Get shipping options from region context
  const shippingOptions = getShippingOptions();
  
  // Initialize addresses from user data
  useEffect(() => {
    if (currentUser && currentUser.addresses) {
      setAddresses(currentUser.addresses);
      
      // If there's a default address, select it
      const defaultAddress = currentUser.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (currentUser.addresses.length > 0) {
        setSelectedAddressId(currentUser.addresses[0].id);
      }
    }
  }, [currentUser]);
  
  // Update shipping address when selected address changes
  useEffect(() => {
    if (selectedAddressId) {
      const selected = addresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        setShippingAddress(selected);
      }
    }
  }, [selectedAddressId, addresses, setShippingAddress]);
  
  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddress(null);
  };
  
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddingAddress(true);
  };
  
  const handleDeleteAddress = (address) => {
    if (window.confirm(t('checkout.confirmDeleteAddress'))) {
      const updatedAddresses = addresses.filter(addr => addr.id !== address.id);
      setAddresses(updatedAddresses);
      
      // If the deleted address was selected, select another one
      if (selectedAddressId === address.id) {
        const defaultAddress = updatedAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (updatedAddresses.length > 0) {
          setSelectedAddressId(updatedAddresses[0].id);
        } else {
          setSelectedAddressId(null);
        }
      }
    }
  };
  
  const handleSaveAddress = (addressData) => {
    let updatedAddresses;
    
    if (addressData.id) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === addressData.id ? addressData : addr
      );
    } else {
      // Add new address with a new ID
      const newAddress = {
        ...addressData,
        id: Date.now() // Use timestamp as ID
      };
      updatedAddresses = [...addresses, newAddress];
      
      // Select the new address
      setSelectedAddressId(newAddress.id);
    }
    
    // If this is set as default, update other addresses
    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === (addressData.id || Date.now())
      }));
    }
    
    setAddresses(updatedAddresses);
    setIsAddingAddress(false);
    setEditingAddress(null);
  };
  
  const handleContinue = () => {
    if (!selectedAddressId) {
      alert(t('checkout.selectAddressAlert'));
      return;
    }
    
    // Update shipping address with shipping method
    const selected = addresses.find(addr => addr.id === selectedAddressId);
    setShippingAddress({
      ...selected,
      shippingMethod
    });
    
    onNext();
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {t('checkout.shippingInformation')}
      </h2>
      
      {isAddingAddress ? (
        <AddressForm 
          address={editingAddress} 
          onSave={handleSaveAddress} 
          onCancel={() => {
            setIsAddingAddress(false);
            setEditingAddress(null);
          }} 
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('checkout.shippingAddress')}
              </h3>
              
              <button
                onClick={handleAddAddress}
                className="btn-outline-sm"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                {t('account.addAddress')}
              </button>
            </div>
            
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(address => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={selectedAddressId === address.id}
                    onSelect={() => setSelectedAddressId(address.id)}
                    onEdit={() => handleEditAddress(address)}
                    onDelete={() => handleDeleteAddress(address)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600 mb-4">{t('checkout.noAddresses')}</p>
                <button
                  onClick={handleAddAddress}
                  className="btn-primary"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  {t('account.addAddress')}
                </button>
              </div>
            )}
          </div>
          
          {selectedAddressId && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('checkout.shippingMethod')}
              </h3>
              
              <div className="space-y-4">
                <label className="block border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50">
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="form-radio mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {t('checkout.standard')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('checkout.standardDesc')}
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {shippingOptions.domestic.standard === 0 
                          ? t('shipping.free') 
                          : t('checkout.price', { price: shippingOptions.domestic.standard.toFixed(2) })}
                      </div>
                    </div>
                  </div>
                </label>
                
                <label className="block border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50">
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="form-radio mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {t('checkout.express')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('checkout.expressDesc')}
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {t('checkout.price', { price: shippingOptions.domestic.express.toFixed(2) })}
                      </div>
                    </div>
                  </div>
                </label>
                
                <label className="block border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50">
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="overnight"
                      checked={shippingMethod === 'overnight'}
                      onChange={() => setShippingMethod('overnight')}
                      className="form-radio mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {t('checkout.overnight')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('checkout.overnightDesc')}
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {t('checkout.price', { price: shippingOptions.domestic.overnight.toFixed(2) })}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedAddressId}
              className="btn-primary"
            >
              {t('checkout.continue')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShippingStep;
