import api from './api';

export interface LoyaltyAccount {
  id: number;
  userId: number;
  pointsBalance: number;
  lifetimePoints: number;
  tier: string;
  tierDisplayName: string;
  pointsMultiplier: number;
  pointsToNextTier: number;
  nextTier: string | null;
  birthday: string | null;
  birthdayBonusAvailable: boolean;
}

export interface PointsTransaction {
  id: number;
  points: number;
  type: string;
  description: string;
  orderId: number | null;
  multiplierApplied: number | null;
  balanceAfter: number;
  createdAt: string;
}

export interface TransactionsResponse {
  content: PointsTransaction[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const loyaltyApi = {
  getAccount: async (): Promise<LoyaltyAccount> => {
    const response = await api.get('/loyalty/account');
    return response.data;
  },

  getTransactions: async (page = 0, size = 10): Promise<TransactionsResponse> => {
    const response = await api.get(`/loyalty/transactions?page=${page}&size=${size}`);
    return response.data;
  },

  setBirthday: async (birthday: string): Promise<LoyaltyAccount> => {
    const response = await api.post('/loyalty/birthday', { birthday });
    return response.data;
  },

  claimBirthdayBonus: async (): Promise<PointsTransaction> => {
    const response = await api.post('/loyalty/birthday-bonus');
    return response.data;
  },

  redeemPoints: async (points: number, orderId?: number): Promise<PointsTransaction> => {
    const response = await api.post('/loyalty/redeem', { points, orderId });
    return response.data;
  },

  calculateDiscount: async (points: number): Promise<{ points: number; discount: number }> => {
    const response = await api.get(`/loyalty/calculate-discount?points=${points}`);
    return response.data;
  },
};
