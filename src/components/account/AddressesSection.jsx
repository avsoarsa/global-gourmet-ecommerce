import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faSave,
  faMapMarkerAlt, faTimes, faCheck
} from '@fortawesome/free-solid-svg-icons';

// Address Form Component
const AddressForm = ({ address = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: address.type || 'Home',
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    country: address.country || 'United States',
    isDefault: address.isDefault || false
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
    onSave({
      ...address,
      ...formData,
      id: address.id || Date.now() // Generate a new ID if it's a new address
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="form-label">Address Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="street" className="form-label">Street Address</label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="state" className="form-label">State/Province</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="zipCode" className="form-label">ZIP/Postal Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="form-label">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="India">India</option>
            <option value="China">China</option>
            <option value="Brazil">Brazil</option>
            <option value="Mexico">Mexico</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
            <option value="Russia">Russia</option>
            <option value="South Korea">South Korea</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Sweden">Sweden</option>
            <option value="Singapore">Singapore</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="South Africa">South Africa</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Thailand">Thailand</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Philippines">Philippines</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Nepal">Nepal</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Israel">Israel</option>
            <option value="Turkey">Turkey</option>
            <option value="Egypt">Egypt</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Kenya">Kenya</option>
            <option value="Ghana">Ghana</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="Peru">Peru</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="form-checkbox"
        />
        <label htmlFor="isDefault" className="ml-2 text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Address
        </button>
      </div>
    </form>
  );
};

// Address Card Component
const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`border rounded-lg p-4 ${address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className={`mr-2 ${address.isDefault ? 'text-green-600' : 'text-gray-500'}`} />
          <span className="font-medium">{address.type}</span>
          {address.isDefault && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(address)}
            className="text-gray-500 hover:text-gray-700"
            title="Edit Address"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="text-gray-500 hover:text-red-600"
            title="Delete Address"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <div className="text-gray-700 space-y-1">
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
      </div>

      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
        >
          <FontAwesomeIcon icon={faCheck} className="mr-1" />
          Set as Default
        </button>
      )}
    </div>
  );
};

const AddressesSection = ({ addresses: initialAddresses }) => {
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingAddress(null);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsAddingNew(false);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    }
  };

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleSaveAddress = (address) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr =>
        addr.id === address.id ? address :
        // If the new address is set as default, make sure other addresses are not default
        address.isDefault ? { ...addr, isDefault: false } : addr
      ));
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddresses = [...addresses];

      // If the new address is set as default, make sure other addresses are not default
      if (address.isDefault) {
        newAddresses.forEach(addr => {
          addr.isDefault = false;
        });
      }

      // If this is the first address, make it default
      if (newAddresses.length === 0) {
        address.isDefault = true;
      }

      newAddresses.push(address);
      setAddresses(newAddresses);
      setIsAddingNew(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-3">Address Book</h2>

        {!isAddingNew && !editingAddress && (
          <button
            onClick={handleAddNew}
            className="btn-primary"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Address
          </button>
        )}
      </div>

      {isAddingNew && (
        <div className="mb-8 border rounded-lg p-6 bg-gray-50">
          <h3 className="heading-4 mb-4">Add New Address</h3>
          <AddressForm
            onSave={handleSaveAddress}
            onCancel={() => setIsAddingNew(false)}
          />
        </div>
      )}

      {editingAddress && (
        <div className="mb-8 border rounded-lg p-6 bg-gray-50">
          <h3 className="heading-4 mb-4">Edit Address</h3>
          <AddressForm
            address={editingAddress}
            onSave={handleSaveAddress}
            onCancel={() => setEditingAddress(null)}
          />
        </div>
      )}

      {!isAddingNew && !editingAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length > 0 ? (
            addresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">You don't have any saved addresses yet.</p>
              <button
                onClick={handleAddNew}
                className="mt-4 btn-outline"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressesSection;
