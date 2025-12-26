'use client';

import Link from 'next/link';
import { Cart } from '@/types';
import { Button } from '@/components/common/Button';

interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  const subtotal = cart.totalAmount;
  const shipping = cart.totalItems > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout">
        <Button className="w-full mt-6" size="lg" disabled={cart.totalItems === 0}>
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/products">
        <Button variant="outline" className="w-full mt-3" size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
}
