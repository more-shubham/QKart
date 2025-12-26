'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { CouponValidationResponse } from '@/types';
import { Button } from '@/components/common/Button';
import { TagIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CouponInputProps {
  userId: number;
  orderAmount: number;
  onCouponApplied: (coupon: CouponValidationResponse | null) => void;
  appliedCoupon: CouponValidationResponse | null;
}

export function CouponInput({
  userId,
  orderAmount,
  onCouponApplied,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await api.validateCoupon({
        code: code.trim(),
        userId,
        orderAmount,
      });

      if (response.valid) {
        onCouponApplied(response);
        setCode('');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponApplied(null);
    setError(null);
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.discountType === 'PERCENTAGE'
                  ? `${appliedCoupon.discountValue}% off`
                  : `$${appliedCoupon.discountValue?.toFixed(2)} off`}
                {' - '}You save ${appliedCoupon.discountAmount?.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-800 p-1"
            aria-label="Remove coupon"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <TagIcon className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Have a coupon?</h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApplyCoupon();
            }
          }}
        />
        <Button
          onClick={handleApplyCoupon}
          loading={isValidating}
          variant="secondary"
        >
          Apply
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
