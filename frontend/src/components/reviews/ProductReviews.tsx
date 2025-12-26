'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Review, ProductRatingSummary, CreateReviewRequest } from '@/types';
import { StarIcon, CheckBadgeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ProductRatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
    fetchSummary();
  }, [productId, sortBy, currentPage]);

  useEffect(() => {
    // Check if user has already reviewed
    if (isAuthenticated && user && reviews.length > 0) {
      const existing = reviews.find(r => r.userId === user.id);
      setUserReview(existing || null);
    }
  }, [reviews, user, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      const data = await api.getProductReviews(productId, sortBy, currentPage, 5);
      setReviews(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await api.getProductRatingSummary(productId);
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch rating summary:', error);
    }
  };

  const handleReviewSubmit = async (review: CreateReviewRequest) => {
    if (!user) return;

    try {
      if (userReview) {
        await api.updateReview(user.id, userReview.id, review);
      } else {
        await api.createReview(user.id, review);
      }
      setShowForm(false);
      setCurrentPage(0);
      fetchReviews();
      fetchSummary();
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  };

  const handleHelpful = async (reviewId: number) => {
    try {
      await api.markReviewHelpful(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          {summary && (
            <RatingSummary
              summary={summary}
              onWriteReview={() => setShowForm(true)}
              canReview={isAuthenticated && !userReview}
              hasReviewed={!!userReview}
            />
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(0);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Review Form */}
          {showForm && (
            <ReviewForm
              productId={productId}
              existingReview={userReview}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Reviews */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={() => handleHelpful(review.id)}
                  isOwn={user?.id === review.userId}
                  onEdit={() => setShowForm(true)}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No reviews yet</p>
              {isAuthenticated && !userReview && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                >
                  Be the first to review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Rating Summary Component
function RatingSummary({
  summary,
  onWriteReview,
  canReview,
  hasReviewed,
}: {
  summary: ProductRatingSummary;
  onWriteReview: () => void;
  canReview: boolean;
  hasReviewed: boolean;
}) {
  const maxCount = Math.max(...Object.values(summary.ratingDistribution), 1);

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-900">
          {summary.averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-6 h-6 ${
                star <= Math.round(summary.averageRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600 mt-2">
          Based on {summary.totalReviews} reviews
        </p>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = summary.ratingDistribution[rating] || 0;
          const percentage = summary.totalReviews > 0
            ? (count / summary.totalReviews) * 100
            : 0;

          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-8">{rating}</span>
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          );
        })}
      </div>

      {canReview && (
        <button
          onClick={onWriteReview}
          className="w-full mt-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Write a Review
        </button>
      )}

      {hasReviewed && (
        <button
          onClick={onWriteReview}
          className="w-full mt-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50"
        >
          Edit Your Review
        </button>
      )}
    </div>
  );
}

// Review Form Component
function ReviewForm({
  productId,
  existingReview,
  onSubmit,
  onCancel,
}: {
  productId: number;
  existingReview: Review | null;
  onSubmit: (review: CreateReviewRequest) => Promise<void>;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({ productId, rating, title, comment });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              {star <= (hoverRating || rating) ? (
                <StarIcon className="w-8 h-8 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="w-8 h-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Summarize your experience"
        />
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your experience with this product"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Review Card Component
function ReviewCard({
  review,
  onHelpful,
  isOwn,
  onEdit,
}: {
  review: Review;
  onHelpful: () => void;
  isOwn: boolean;
  onEdit: () => void;
}) {
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const handleHelpful = () => {
    if (helpfulClicked) return;
    setHelpfulClicked(true);
    onHelpful();
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{review.userName}</span>
            {review.verifiedPurchase && (
              <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckBadgeIcon className="w-3 h-3 mr-1" />
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isOwn && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        )}
      </div>

      {review.title && (
        <h4 className="font-medium text-gray-900 mt-3">{review.title}</h4>
      )}

      {review.comment && (
        <p className="text-gray-600 mt-2">{review.comment}</p>
      )}

      <div className="mt-4">
        <button
          onClick={handleHelpful}
          disabled={helpfulClicked}
          className={`flex items-center text-sm ${
            helpfulClicked
              ? 'text-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <HandThumbUpIcon className="w-4 h-4 mr-1" />
          Helpful ({review.helpfulCount + (helpfulClicked ? 1 : 0)})
        </button>
      </div>
    </div>
  );
}
