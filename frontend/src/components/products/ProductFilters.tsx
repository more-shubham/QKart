'use client';

import { useState, useEffect } from 'react';
import { ProductSearchCriteria } from '@/types';
import { StarIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/solid';

interface ProductFiltersProps {
  categories: string[];
  priceRange: { min: number; max: number };
  criteria: ProductSearchCriteria;
  onCriteriaChange: (criteria: ProductSearchCriteria) => void;
}

export function ProductFilters({
  categories,
  priceRange,
  criteria,
  onCriteriaChange,
}: ProductFiltersProps) {
  const [localMinPrice, setLocalMinPrice] = useState(criteria.minPrice ?? priceRange.min);
  const [localMaxPrice, setLocalMaxPrice] = useState(criteria.maxPrice ?? priceRange.max);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setLocalMinPrice(criteria.minPrice ?? priceRange.min);
    setLocalMaxPrice(criteria.maxPrice ?? priceRange.max);
  }, [criteria.minPrice, criteria.maxPrice, priceRange]);

  const handleCategoryToggle = (category: string) => {
    const currentCategories = criteria.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    onCriteriaChange({
      ...criteria,
      categories: newCategories.length > 0 ? newCategories : undefined,
      page: 0,
    });
  };

  const handlePriceChange = () => {
    onCriteriaChange({
      ...criteria,
      minPrice: localMinPrice > priceRange.min ? localMinPrice : undefined,
      maxPrice: localMaxPrice < priceRange.max ? localMaxPrice : undefined,
      page: 0,
    });
  };

  const handleRatingFilter = (rating: number) => {
    onCriteriaChange({
      ...criteria,
      minRating: criteria.minRating === rating ? undefined : rating,
      page: 0,
    });
  };

  const handleStockFilter = (inStock: boolean) => {
    onCriteriaChange({
      ...criteria,
      inStock: criteria.inStock === inStock ? undefined : inStock,
      page: 0,
    });
  };

  const handleClearAll = () => {
    onCriteriaChange({
      query: criteria.query,
      sortBy: criteria.sortBy,
      sortOrder: criteria.sortOrder,
      page: 0,
    });
    setLocalMinPrice(priceRange.min);
    setLocalMaxPrice(priceRange.max);
  };

  const hasActiveFilters =
    (criteria.categories && criteria.categories.length > 0) ||
    criteria.minPrice !== undefined ||
    criteria.maxPrice !== undefined ||
    criteria.minRating !== undefined ||
    criteria.inStock !== undefined;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <XMarkIcon className="w-4 h-4 mr-1" />
          Clear all filters
        </button>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={criteria.categories?.includes(category) || false}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 group-hover:text-gray-900">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(Number(e.target.value))}
                  onBlur={handlePriceChange}
                  min={priceRange.min}
                  max={localMaxPrice}
                  className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <span className="text-gray-400 mt-5">-</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                  onBlur={handlePriceChange}
                  min={localMinPrice}
                  max={priceRange.max}
                  className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          {/* Price Range Slider */}
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
            onMouseUp={handlePriceChange}
            onTouchEnd={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className={`w-full flex items-center py-2 px-3 rounded-lg transition-colors ${
                criteria.minRating === rating
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={criteria.inStock === true}
              onChange={() => handleStockFilter(true)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700 group-hover:text-gray-900">
              In Stock
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={criteria.inStock === false}
              onChange={() => handleStockFilter(false)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700 group-hover:text-gray-900">
              Out of Stock
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
      >
        <FunnelIcon className="w-5 h-5 mr-2" />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
