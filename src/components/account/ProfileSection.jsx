import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

const ProfileSection = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Extract user data from either the old format or the Supabase format
  const firstName = user.firstName || user.user?.user_metadata?.first_name || '';
  const lastName = user.lastName || user.user?.user_metadata?.last_name || '';
  const email = user.email || user.user?.email || '';
  const phone = user.phone || user.user?.phone || '';
  const birthdate = user.birthdate || user.user?.user_metadata?.birthdate || '';

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    phone,
    birthdate,
    preferences: {
      emailNotifications: user.preferences?.emailNotifications || true,
      smsNotifications: user.preferences?.smsNotifications || false,
      newsletterSubscription: user.preferences?.newsletterSubscription || true
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested properties (preferences)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // In a real implementation, we would update the user profile in Supabase
      console.log('Updated profile:', formData);

      // For now, we'll just simulate a successful update
      setIsEditing(false);

      // Show success message
      alert('Profile updated successfully!');

      // In a real implementation, we would do something like:
      /*
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          birthdate: formData.birthdate,
          preferences: formData.preferences
        }
      });

      if (error) {
        throw error;
      }
      */
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-3">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-outline"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
              placeholder="(123) 456-7890"
            />
          </div>

          <div>
            <label htmlFor="birthdate" className="form-label">Date of Birth</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${!isEditing ? 'bg-gray-50' : ''}`}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="heading-4 mb-4">Communication Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="preferences.emailNotifications"
                checked={formData.preferences.emailNotifications}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-checkbox"
              />
              <label htmlFor="emailNotifications" className="ml-2 text-gray-700">
                Receive email notifications about orders and promotions
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                name="preferences.smsNotifications"
                checked={formData.preferences.smsNotifications}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-checkbox"
              />
              <label htmlFor="smsNotifications" className="ml-2 text-gray-700">
                Receive SMS notifications about orders and promotions
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletterSubscription"
                name="preferences.newsletterSubscription"
                checked={formData.preferences.newsletterSubscription}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-checkbox"
              />
              <label htmlFor="newsletterSubscription" className="ml-2 text-gray-700">
                Subscribe to our newsletter for updates and special offers
              </label>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSection;
