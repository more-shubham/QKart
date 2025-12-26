'use client';

import { useState, useEffect } from 'react';
import { loyaltyApi, LoyaltyAccount } from '@/services/loyaltyApi';

interface PointsRedemptionProps {
  maxDiscount: number;
  onPointsApplied: (points: number, discount: number) => void;
  appliedPoints?: number;
}

export default function PointsRedemption({
  maxDiscount,
  onPointsApplied,
  appliedPoints = 0,
}: PointsRedemptionProps) {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [pointsToUse, setPointsToUse] = useState(appliedPoints);
  const [loading, setLoading] = useState(true);

  const POINTS_PER_DOLLAR = 100;

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const data = await loyaltyApi.getAccount();
      setAccount(data);
    } catch (error) {
      console.error('Failed to load loyalty account:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxPointsAllowed = Math.min(
    account?.pointsBalance || 0,
    Math.floor(maxDiscount * POINTS_PER_DOLLAR)
  );

  const discount = pointsToUse / POINTS_PER_DOLLAR;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    setPointsToUse(points);
  };

  const handleApply = () => {
    onPointsApplied(pointsToUse, discount);
  };

  const handleRemove = () => {
    setPointsToUse(0);
    onPointsApplied(0, 0);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!account || account.pointsBalance === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-600 text-sm">
          You have no loyalty points to redeem.{' '}
          <span className="text-indigo-600">Earn points with every purchase!</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Redeem Loyalty Points</h3>
        <span className="text-sm text-gray-600">
          Available: <span className="font-semibold text-indigo-600">{account.pointsBalance.toLocaleString()}</span> pts
        </span>
      </div>

      {appliedPoints > 0 ? (
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
          <div>
            <p className="text-green-700 font-medium">
              {appliedPoints.toLocaleString()} points applied
            </p>
            <p className="text-sm text-green-600">
              Saving ${(appliedPoints / POINTS_PER_DOLLAR).toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={maxPointsAllowed}
              step="100"
              value={pointsToUse}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 pts</span>
              <span>{maxPointsAllowed.toLocaleString()} pts</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Use <span className="font-semibold text-gray-900">{pointsToUse.toLocaleString()}</span> points
              </p>
              <p className="text-xs text-gray-500">
                Save ${discount.toFixed(2)} on this order
              </p>
            </div>
            <button
              onClick={handleApply}
              disabled={pointsToUse === 0}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Points
            </button>
          </div>
        </>
      )}

      <p className="text-xs text-gray-500 mt-3">
        100 points = $1.00 discount
      </p>
    </div>
  );
}
