import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faTimes, faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../context/AuthContext';

// Star Rating Input Component
const StarRatingInput = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  return (
    <div>
      <div className="flex items-center mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-2xl focus:outline-none p-1"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <FontAwesomeIcon
              icon={(hoverRating || rating) >= star ? faStarSolid : faStarRegular}
              className={(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm font-medium text-gray-700">
            {ratingLabels[rating]}
          </span>
        )}
      </div>
    </div>
  );
};

// Image Upload Preview Component
const ImagePreview = ({ images, removeImage }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Image Previews:</p>
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Review Form Component
const ReviewForm = ({ productId, productName, onSubmit, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));

    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // For demo purposes, we'll just use the file URLs
    // In a real app, you would upload these to a server
    const newImages = files.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Please enter your review';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      if (!currentUser) {
        setErrors({ submit: 'Please log in to submit a review.' });
        return;
      }

      // In a real app, this would be an API call
      const reviewData = {
        productId,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userAvatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=0D8ABC&color=fff`,
        rating: formData.rating,
        title: formData.title.trim(),
        content: formData.content.trim(),
        images: formData.images
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">You're reviewing: <span className="font-medium">{productName}</span></p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRatingInput
            rating={formData.rating}
            setRating={handleRatingChange}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Summarize your experience (optional)"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Review *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            className="form-input"
            placeholder="What did you like or dislike about this product? How was the quality? Would you recommend it to others?"
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (optional)
          </label>
          <div className="flex items-center">
            <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors">
              <FontAwesomeIcon icon={faImage} className="mr-2 text-gray-600" />
              <span className="text-gray-700">Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <span className="ml-3 text-xs text-gray-500">
              Up to 5 images (PNG, JPG)
            </span>
          </div>
          <ImagePreview images={formData.images} removeImage={removeImage} />
        </div>

        {errors.submit && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
            {errors.submit}
            {errors.submit === 'Please log in to submit a review.' && (
              <div className="mt-2">
                <a href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="text-red-700 font-medium underline">Log in</a>
                <span className="mx-2">or</span>
                <a href={`/register?redirect=${encodeURIComponent(window.location.pathname)}`} className="text-red-700 font-medium underline">Create an account</a>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
