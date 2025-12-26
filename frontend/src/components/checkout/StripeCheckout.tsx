'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from './PaymentForm';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeCheckoutProps {
  amount: number;
  orderId?: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function StripeCheckout({
  amount,
  orderId,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError('Please log in to continue');
      setIsLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const response = await api.createPaymentIntent({
          userId: user.id,
          amount,
          orderId,
        });
        setClientSecret(response.clientSecret);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(message);
        onError(message);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [user, amount, orderId, onError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600">Unable to initialize payment</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#dc2626',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      <PaymentForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
