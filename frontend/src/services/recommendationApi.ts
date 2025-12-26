import api from './api';
import { Product } from './productApi';

export interface Recommendation {
  type: string;
  title: string;
  description: string;
  products: Product[];
}

export const recommendationApi = {
  getPersonalized: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations/personalized');
    return response.data;
  },

  getProductRecommendations: async (productId: number): Promise<Recommendation[]> => {
    const response = await api.get(`/recommendations/product/${productId}`);
    return response.data;
  },

  getGuestRecommendations: async (): Promise<Recommendation> => {
    const response = await api.get('/recommendations/guest');
    return response.data;
  },
};
