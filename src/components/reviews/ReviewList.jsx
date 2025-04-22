import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faThumbsUp,
  faFilter,
  faSort,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { format, parseISO } from 'date-fns';

// Star Rating Component
const StarRating = ({ rating, size = 'sm' }) => {
  const stars = [];
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        icon={i <= rating ? faStarSolid : faStarRegular}
        className={`${i <= rating ? 'text-yellow-400' : 'text-gray-300'} ${sizeClass}`}
      />
    );
  }

  return <div className="flex space-x-1">{stars}</div>;
};

// Review Item Component
const ReviewItem = ({ review, onMarkHelpful }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleImageClick = (image) => {
    setCurrentImage(image);
    setIsImageModalOpen(true);
  };

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} />
              <span className="text-sm text-gray-500">
                {format(parseISO(review.date), 'MMM d, yyyy')}
              </span>
              {review.verified && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {review.title && (
        <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
      )}

      <p className="text-gray-700 mb-4">{review.content}</p>

      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={faImage} className="mr-2" />
            Customer Images
          </p>
          <div className="flex flex-wrap gap-2">
            {review.images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(image)}
                className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 hover:border-green-500 transition-colors"
              >
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => onMarkHelpful(review.id)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
          Helpful ({review.helpfulCount})
        </button>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setIsImageModalOpen(false)}>
          <div className="max-w-4xl max-h-[90vh] overflow-hidden">
            <img
              src={currentImage}
              alt="Review"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Rating Summary Component
const RatingSummary = ({ reviews }) => {
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5 stars to 1 star
  reviews.forEach(review => {
    ratingCounts[5 - review.rating]++;
  });

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)} out of 5
          </h3>
          <StarRating rating={Math.round(averageRating)} size="lg" />
          <p className="text-sm text-gray-500 mt-1">
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="w-full md:w-1/2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingCounts[5 - star];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

            return (
              <div key={star} className="flex items-center mb-1">
                <div className="w-12 text-sm text-gray-600 font-medium">
                  {star} star
                </div>
                <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main ReviewList Component
const ReviewList = ({ reviews, onMarkHelpful, onWriteReview, compact = false }) => {
  const { currentUser } = useAuth();
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(0); // 0 means all ratings

  // Handle write review click with auth check
  const handleWriteReviewClick = () => {
    if (!currentUser) {
      // Show a more user-friendly message with login option
      const confirmLogin = window.confirm('You need to be logged in to write a review. Would you like to log in now?');
      if (confirmLogin) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
      return;
    }
    onWriteReview();
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'lowest') {
      return a.rating - b.rating;
    } else if (sortBy === 'helpful') {
      return b.helpfulCount - a.helpfulCount;
    }
    return 0;
  });

  // Filter reviews by rating
  const filteredReviews = filterRating === 0
    ? sortedReviews
    : sortedReviews.filter(review => review.rating === filterRating);

  // Render different layouts based on compact mode
  if (compact) {
    return (
      <div>
        {reviews.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                Top Reviews ({reviews.length}) <span className="text-xs text-gray-500">(Showing most recent)</span>
              </h3>
              <button
                onClick={handleWriteReviewClick}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Write a Review
              </button>
            </div>

            <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredReviews.map(review => (
                <div key={review.id} className="py-3">
                  <div className="flex items-center mb-1">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-500 ml-2">
                      {format(parseISO(review.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">{review.content}</p>
                  <div className="text-xs text-gray-500">{review.userName}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-3">
            <p className="text-xs text-gray-600 mb-2">No reviews yet</p>
            <button
              onClick={handleWriteReviewClick}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Be the first to review
            </button>
          </div>
        )}
      </div>
    );
  }

  // Regular full-size review list
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length}) <span className="text-sm font-normal text-gray-500">(Showing most recent)</span>
        </h2>
        <button
          onClick={handleWriteReviewClick}
          className="btn-primary"
        >
          Write a Review
        </button>
      </div>

      {reviews.length > 0 ? (
        <>
          <RatingSummary reviews={reviews} />

          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <label className="text-sm font-medium text-gray-700 mr-2">
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Filter by:
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="form-select py-1 text-sm"
              >
                <option value={0}>All Ratings</option>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                <FontAwesomeIcon icon={faSort} className="mr-2" />
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select py-1 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onMarkHelpful={onMarkHelpful}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No reviews match your current filter.</p>
                <button
                  onClick={() => setFilterRating(0)}
                  className="mt-2 text-green-600 hover:text-green-700 font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">This product doesn't have any reviews yet.</p>
          <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
          <button
            onClick={handleWriteReviewClick}
            className="btn-primary"
          >
            Write a Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
