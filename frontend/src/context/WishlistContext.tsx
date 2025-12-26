'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/services/api';
import { useAuth } from './AuthContext';
import { WishlistItem } from '@/types';

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const items = await api.getWishlist(user.id);
      setWishlist(items);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  const addToWishlist = async (productId: number) => {
    if (!user) return;

    try {
      const item = await api.addToWishlist(user.id, productId);
      setWishlist(prev => [item, ...prev]);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;

    try {
      await api.removeFromWishlist(user.id, productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  const toggleWishlist = async (productId: number) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      await api.clearWishlist(user.id);
      setWishlist([]);
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
