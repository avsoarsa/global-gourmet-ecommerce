import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const ProfileSection = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { updateUserProfile } = useAuth();
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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating profile:', formData);

      // Update user metadata in Supabase Auth
      const { success, error } = await updateUserProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        birthdate: formData.birthdate,
        preferences: formData.preferences
      });

      if (!success) {
        throw new Error(error || 'Failed to update profile');
      }

      // Also update the profile in the profiles table if it exists
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user profile exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingProfile) {
          // Update existing profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              phone: formData.phone,
              birthdate: formData.birthdate,
              preferences: formData.preferences
            })
            .eq('user_id', user.id);

          if (profileError) {
            console.error('Error updating profile in database:', profileError);
          }
        } else {
          // Create new profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,
              phone: formData.phone,
              birthdate: formData.birthdate,
              preferences: formData.preferences
            });

          if (profileError) {
            console.error('Error creating profile in database:', profileError);
          }
        }
      }

      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

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
              onClick={() => {
                setIsEditing(false);
                setError('');
                setSuccess('');
              }}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSection;
