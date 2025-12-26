'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Cart, CartItem, AddToCartRequest } from '@/types';
import { api } from '@/services/api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: Error | null;
  addToCart: (request: AddToCartRequest) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_USER_ID = 1; // Demo user

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const cartData = await api.getCart(DEFAULT_USER_ID);
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (request: AddToCartRequest) => {
    try {
      const updatedCart = await api.addToCart(DEFAULT_USER_ID, request);
      setCart(updatedCart);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItem(DEFAULT_USER_ID, productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (productId: number) => {
    try {
      const updatedCart = await api.removeFromCart(DEFAULT_USER_ID, productId);
      setCart(updatedCart);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await api.clearCart(DEFAULT_USER_ID);
      setCart((prev) =>
        prev ? { ...prev, items: [], totalAmount: 0, totalItems: 0 } : null
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
