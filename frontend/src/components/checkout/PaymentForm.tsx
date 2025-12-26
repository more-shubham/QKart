'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/common/Button';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An error occurred');
        onError(error.message || 'Payment failed');
      } else {
        setMessage('An unexpected error occurred');
        onError('An unexpected error occurred');
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{message}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        loading={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}
