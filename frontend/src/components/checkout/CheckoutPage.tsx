'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Address, Cart } from '@/types';
import { api, fetchCheckoutData } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { AddressSelector } from './AddressSelector';
import { AddressForm } from './AddressForm';
import { OrderReview } from './OrderReview';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const DEFAULT_USER_ID = 1;

export function CheckoutPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCheckoutData(DEFAULT_USER_ID);
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
  }, []);

  const handleAddressAdded = (address: Address) => {
    setAddresses((prev) => [...prev, address]);
    if (address.id) {
      setSelectedAddressId(address.id);
    }
    setShowAddressForm(false);
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
        userId: DEFAULT_USER_ID,
        shippingAddressId: selectedAddressId,
      });
      setOrderId(order.id);
      setOrderPlaced(true);
      await refreshCart();
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (orderPlaced && orderId) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <CheckCircleIcon className="w-24 h-24 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-2">Thank you for your order.</p>
        <p className="text-gray-500 mb-8">Order ID: #{orderId}</p>
        <div className="flex gap-4 justify-center">
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
          {showAddressForm ? (
            <AddressForm
              userId={DEFAULT_USER_ID}
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

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4">
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-gray-600 mt-1">
                Pay when your order is delivered
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <OrderReview cart={cart} />
            <Button
              size="lg"
              className="w-full"
              onClick={handlePlaceOrder}
              loading={isPlacingOrder}
              disabled={!selectedAddressId || addresses.length === 0}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
