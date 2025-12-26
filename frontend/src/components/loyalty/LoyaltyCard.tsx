'use client';

import { useState, useEffect } from 'react';
import { loyaltyApi, LoyaltyAccount } from '@/services/loyaltyApi';
import Link from 'next/link';

const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  BRONZE: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  SILVER: { bg: 'bg-gray-200', text: 'text-gray-700', border: 'border-gray-400' },
  GOLD: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400' },
  PLATINUM: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
};

export default function LoyaltyCard() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

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

  const handleClaimBirthday = async () => {
    if (!account?.birthdayBonusAvailable) return;

    setClaiming(true);
    try {
      await loyaltyApi.claimBirthdayBonus();
      await loadAccount();
    } catch (error) {
      console.error('Failed to claim birthday bonus:', error);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  const tierStyle = tierColors[account.tier] || tierColors.BRONZE;
  const progressPercent = account.nextTier
    ? ((account.lifetimePoints % 1000) / (account.pointsToNextTier + (account.lifetimePoints % 1000))) * 100
    : 100;

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${tierStyle.border} border-2`}>
      <div className={`${tierStyle.bg} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${tierStyle.text}`}>
              {account.tierDisplayName} Member
            </p>
            <p className={`text-xs ${tierStyle.text} opacity-75`}>
              {account.pointsMultiplier}x points multiplier
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {account.pointsBalance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Available Points</p>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-4">
        {account.nextTier && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress to {account.nextTier}</span>
              <span className="text-gray-900 font-medium">
                {account.pointsToNextTier.toLocaleString()} points to go
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${tierStyle.bg.replace('100', '500')}`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {account.birthdayBonusAvailable && (
          <div className="mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-pink-800">Happy Birthday!</p>
                <p className="text-sm text-pink-600">Claim your 500 bonus points</p>
              </div>
              <button
                onClick={handleClaimBirthday}
                disabled={claiming}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {claiming ? 'Claiming...' : 'Claim'}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Lifetime: {account.lifetimePoints.toLocaleString()} points
          </span>
          <Link
            href="/account/loyalty"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
