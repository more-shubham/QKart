'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/LoadingSpinner';
import {
  ShoppingBagIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircleIcon,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-purple-100 text-purple-800',
    icon: ClockIcon,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-indigo-100 text-indigo-800',
    icon: TruckIcon,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'bg-cyan-100 text-cyan-800',
    icon: TruckIcon,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
  },
};

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      if (!user?.id) return;
      try {
        const data = await api.getUserOrders(user.id);
        setOrders(data);
      } catch {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Please log in to view your orders
          </h2>
          <Link href="/login?redirect=/orders">
            <Button size="lg">Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">{error}</h2>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to see your orders here
          </p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div
                          key={item.id}
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 ring-2 ring-white"
                          style={{ zIndex: order.items.length - idx }}
                        >
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div
                          className="relative w-12 h-12 rounded-lg bg-gray-200 ring-2 ring-white flex items-center justify-center"
                          style={{ zIndex: 0 }}
                        >
                          <span className="text-xs font-medium text-gray-600">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && order.status !== 'DELIVERED' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tracking:</span>{' '}
                        {order.trackingNumber}
                        {order.shippingCarrier && ` via ${order.shippingCarrier}`}
                      </p>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {order.estimatedDeliveryDate &&
                    order.status !== 'DELIVERED' &&
                    order.status !== 'CANCELLED' && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">
                          Est. delivery:{' '}
                          {new Date(order.estimatedDeliveryDate).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
