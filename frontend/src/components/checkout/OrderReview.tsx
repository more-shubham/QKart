'use client';

import Image from 'next/image';
import { Cart, CouponValidationResponse } from '@/types';

interface OrderReviewProps {
  cart: Cart;
  appliedCoupon?: CouponValidationResponse | null;
  finalAmount?: number;
}

export function OrderReview({ cart, appliedCoupon, finalAmount }: OrderReviewProps) {
  const subtotal = cart.totalAmount;
  const discount = appliedCoupon?.discountAmount || 0;
  const afterDiscount = finalAmount ?? subtotal;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Order Review</h2>

      <div className="space-y-4 max-h-64 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.productName}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">${item.subtotal.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t mt-6 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {appliedCoupon && discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>
              Discount ({appliedCoupon.code})
              {appliedCoupon.discountType === 'PERCENTAGE' && (
                <span className="text-xs ml-1">({appliedCoupon.discountValue}% off)</span>
              )}
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
