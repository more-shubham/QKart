'use client';

import { useState, useEffect } from 'react';
import { recommendationApi, Recommendation } from '@/services/recommendationApi';
import RecommendationCarousel from './RecommendationCarousel';

interface RecommendationSectionProps {
  productId?: number;
  isAuthenticated?: boolean;
}

export default function RecommendationSection({ productId, isAuthenticated = false }: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [productId, isAuthenticated]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      let data: Recommendation[];

      if (productId) {
        data = await recommendationApi.getProductRecommendations(productId);
      } else if (isAuthenticated) {
        data = await recommendationApi.getPersonalized();
      } else {
        const guestRec = await recommendationApi.getGuestRecommendations();
        data = [guestRec];
      }

      setRecommendations(data.filter(r => r.products.length > 0));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="w-48 flex-shrink-0">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {recommendations.map((recommendation, index) => (
        <RecommendationCarousel key={`${recommendation.type}-${index}`} recommendation={recommendation} />
      ))}
    </div>
  );
}
