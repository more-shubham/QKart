'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Address, Cart, CouponValidationResponse } from '@/types';
import { api, fetchCheckoutData } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AddressSelector } from './AddressSelector';
import { AddressForm } from './AddressForm';
import { OrderReview } from './OrderReview';
import { StripeCheckout } from './StripeCheckout';
import { CouponInput } from './CouponInput';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { CheckCircleIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type PaymentMethod = 'card' | 'cod';

export function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);

  const userId = user?.id || 1;

  // Calculate final amount considering coupon
  const subtotal = cart?.totalAmount || 0;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalAmount = subtotal - discountAmount;

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCheckoutData(userId);
        setCart(data.cart);
        setAddresses(data.addresses);

        // Auto-select default address
        const defaultAddress = data.addresses.find((a) => a.isDefault);
        if (defaultAddress?.id) {
          setSelectedAddressId(defaultAddress.id);
        } else if (data.addresses.length > 0 && data.addresses[0].id) {
          setSelectedAddressId(data.addresses[0].id);
        }
      } catch (err) {
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  const handleAddressAdded = (address: Address) => {
    setAddresses((prev) => [...prev, address]);
    if (address.id) {
      setSelectedAddressId(address.id);
    }
    setShowAddressForm(false);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }
    setError(null);

    if (paymentMethod === 'card') {
      setShowPaymentForm(true);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      const order = await api.checkout({
        userId,
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod === 'card' ? 'CARD' : 'COD',
        couponCode: appliedCoupon?.code,
      });
      setOrderId(order.id);
      setOrderPlaced(true);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await handlePlaceOrder();
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    setShowPaymentForm(false);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to checkout</h2>
        <Link href="/login?redirect=/checkout">
          <Button size="lg">Log In</Button>
        </Link>
      </div>
    );
  }

  if (orderPlaced && orderId) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <CheckCircleIcon className="w-24 h-24 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-2">Thank you for your order.</p>
        <p className="text-gray-500 mb-8">Order ID: #{orderId}</p>
        <div className="flex gap-4 justify-center">
          <Link href={`/orders/${orderId}`}>
            <Button variant="secondary" size="lg">View Order</Button>
          </Link>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          {showAddressForm ? (
            <AddressForm
              userId={userId}
              onAddressAdded={handleAddressAdded}
              onCancel={() => setShowAddressForm(false)}
            />
          ) : (
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={setSelectedAddressId}
              onAddNewClick={() => setShowAddressForm(true)}
            />
          )}

          {/* Coupon Code */}
          <CouponInput
            userId={userId}
            orderAmount={subtotal}
            onCouponApplied={setAppliedCoupon}
            appliedCoupon={appliedCoupon}
          />

          {/* Payment Method Selection */}
          {!showPaymentForm ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCardIcon className={`w-6 h-6 mr-3 ${
                    paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-sm text-gray-500">Pay securely with Stripe</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BanknotesIcon className={`w-6 h-6 mr-3 ${
                    paymentMethod === 'cod' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when your order arrives</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Card Payment</h2>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change payment method
                </button>
              </div>
              <StripeCheckout
                amount={finalAmount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <OrderReview
              cart={cart}
              appliedCoupon={appliedCoupon}
              finalAmount={finalAmount}
            />
            {!showPaymentForm && (
              <Button
                size="lg"
                className="w-full"
                onClick={handleProceedToPayment}
                loading={isPlacingOrder}
                disabled={!selectedAddressId || addresses.length === 0}
              >
                {paymentMethod === 'card' ? 'Continue to Payment' : 'Place Order'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
