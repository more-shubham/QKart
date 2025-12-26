'use client';

import { useState, useEffect } from 'react';
import { loyaltyApi, LoyaltyAccount, PointsTransaction, TransactionsResponse } from '@/services/loyaltyApi';
import LoyaltyCard from '@/components/loyalty/LoyaltyCard';

const transactionTypeStyles: Record<string, { bg: string; text: string; icon: string }> = {
  EARNED: { bg: 'bg-green-100', text: 'text-green-800', icon: '+' },
  REDEEMED: { bg: 'bg-red-100', text: 'text-red-800', icon: '-' },
  BONUS: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '+' },
  EXPIRED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '-' },
  ADJUSTMENT: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '' },
};

export default function LoyaltyPage() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [birthday, setBirthday] = useState('');
  const [settingBirthday, setSettingBirthday] = useState(false);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accountData, transactionsData] = await Promise.all([
        loyaltyApi.getAccount(),
        loyaltyApi.getTransactions(page, 10),
      ]);
      setAccount(accountData);
      setTransactions(transactionsData.content);
      setTotalPages(transactionsData.totalPages);
      if (accountData.birthday) {
        setBirthday(accountData.birthday);
      }
    } catch (error) {
      console.error('Failed to load loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBirthday = async () => {
    if (!birthday) return;
    setSettingBirthday(true);
    try {
      await loyaltyApi.setBirthday(birthday);
      await loadData();
    } catch (error) {
      console.error('Failed to set birthday:', error);
    } finally {
      setSettingBirthday(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !account) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Loyalty Program</h1>

      <div className="mb-8">
        <LoyaltyCard />
      </div>

      {/* Birthday Setup */}
      {account && !account.birthday && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Set Your Birthday</h2>
          <p className="text-gray-600 mb-4">
            Get 500 bonus points on your birthday each year!
          </p>
          <div className="flex gap-4">
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSetBirthday}
              disabled={!birthday || settingBirthday}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {settingBirthday ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Shop & Earn</h3>
            <p className="text-sm text-gray-600">
              Earn 10 points for every $1 spent, multiplied by your tier bonus
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⬆️</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Level Up</h3>
            <p className="text-sm text-gray-600">
              Reach higher tiers for better multipliers (up to 2x as Platinum)
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Redeem Rewards</h3>
            <p className="text-sm text-gray-600">
              Use 100 points for $1 off your next purchase
            </p>
          </div>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tier Benefits</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Tier</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Points Required</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b ${account?.tier === 'BRONZE' ? 'bg-amber-50' : ''}`}>
                <td className="py-3 px-4 font-medium text-amber-700">Bronze</td>
                <td className="py-3 px-4 text-gray-600">0</td>
                <td className="py-3 px-4 text-gray-600">1.0x</td>
              </tr>
              <tr className={`border-b ${account?.tier === 'SILVER' ? 'bg-gray-100' : ''}`}>
                <td className="py-3 px-4 font-medium text-gray-600">Silver</td>
                <td className="py-3 px-4 text-gray-600">1,000</td>
                <td className="py-3 px-4 text-gray-600">1.25x</td>
              </tr>
              <tr className={`border-b ${account?.tier === 'GOLD' ? 'bg-yellow-50' : ''}`}>
                <td className="py-3 px-4 font-medium text-yellow-600">Gold</td>
                <td className="py-3 px-4 text-gray-600">5,000</td>
                <td className="py-3 px-4 text-gray-600">1.5x</td>
              </tr>
              <tr className={`${account?.tier === 'PLATINUM' ? 'bg-purple-50' : ''}`}>
                <td className="py-3 px-4 font-medium text-purple-700">Platinum</td>
                <td className="py-3 px-4 text-gray-600">10,000</td>
                <td className="py-3 px-4 text-gray-600">2.0x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No transactions yet. Start shopping to earn points!
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const style = transactionTypeStyles[transaction.type] || transactionTypeStyles.ADJUSTMENT;
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${style.bg} rounded-full flex items-center justify-center`}>
                        <span className={`font-bold ${style.text}`}>
                          {style.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                          {transaction.multiplierApplied && transaction.multiplierApplied > 1 && (
                            <span className="ml-2 text-indigo-600">
                              ({transaction.multiplierApplied}x multiplier)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()} pts
                      </p>
                      <p className="text-sm text-gray-500">
                        Balance: {transaction.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
