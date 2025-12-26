'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ProductSearchCriteria } from '@/types';

interface SortOption {
  label: string;
  sortBy: ProductSearchCriteria['sortBy'];
  sortOrder: ProductSearchCriteria['sortOrder'];
}

const sortOptions: SortOption[] = [
  { label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Name: Z to A', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Top Rated', sortBy: 'rating', sortOrder: 'desc' },
  { label: 'Newest', sortBy: 'newest', sortOrder: 'desc' },
];

interface SortDropdownProps {
  sortBy?: ProductSearchCriteria['sortBy'];
  sortOrder?: ProductSearchCriteria['sortOrder'];
  onSortChange: (sortBy: ProductSearchCriteria['sortBy'], sortOrder: ProductSearchCriteria['sortOrder']) => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find(
    (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder
  ) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onSortChange(option.sortBy, option.sortOrder);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700"
      >
        <span className="mr-2">Sort: {currentOption.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          {sortOptions.map((option) => (
            <button
              key={`${option.sortBy}-${option.sortOrder}`}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="text-gray-700">{option.label}</span>
              {option.sortBy === sortBy && option.sortOrder === sortOrder && (
                <CheckIcon className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
