'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Order } from '@/types';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/LoadingSpinner';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await api.getOrderById(parseInt(resolvedParams.id));
        setOrder(data);
      } catch {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [resolvedParams.id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Please log in to view order details
          </h2>
          <Link href="/login">
            <Button size="lg">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            {error || 'Order not found'}
          </h2>
          <Link href="/orders">
            <Button variant="secondary">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Tracking */}
          <OrderTracking order={order} />

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.priceAtPurchase.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.couponCode && order.discountAmount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <ReceiptPercentIcon className="w-4 h-4" />
                    Discount ({order.couponCode})
                  </span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%)</span>
                <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(order.totalAmount * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {order.paymentMethod && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                Payment Method
              </h2>
              <p className="text-gray-700">
                {order.paymentMethod === 'CARD' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </p>
            </div>
          )}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Shipping Address
              </h2>
              <address className="text-gray-700 not-italic">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/products">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Link href="/orders">
              <Button variant="secondary" className="w-full">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
