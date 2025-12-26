'use client';

import { Order, OrderStatus } from '@/types';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  CubeIcon,
  HomeIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface OrderTrackingProps {
  order: Order;
}

interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const trackingSteps: TrackingStep[] = [
  {
    status: 'PENDING',
    label: 'Order Placed',
    description: 'Your order has been received',
    icon: ClockIcon,
  },
  {
    status: 'CONFIRMED',
    label: 'Confirmed',
    description: 'Order confirmed and being prepared',
    icon: CheckCircleIcon,
  },
  {
    status: 'PROCESSING',
    label: 'Processing',
    description: 'Your order is being packed',
    icon: CubeIcon,
  },
  {
    status: 'SHIPPED',
    label: 'Shipped',
    description: 'Order is on its way',
    icon: TruckIcon,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    description: 'Your package is nearby',
    icon: TruckIcon,
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Order has been delivered',
    icon: HomeIcon,
  },
];

const statusOrder: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

function getStatusIndex(status: OrderStatus): number {
  return statusOrder.indexOf(status);
}

function getStatusTimestamp(order: Order, status: OrderStatus): string | null {
  switch (status) {
    case 'PENDING':
      return order.createdAt;
    case 'CONFIRMED':
      return order.confirmedAt || null;
    case 'SHIPPED':
      return order.shippedAt || null;
    case 'DELIVERED':
      return order.deliveredAt || null;
    default:
      return null;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getCarrierTrackingUrl(carrier: string, trackingNumber: string): string | null {
  const carrierUrls: Record<string, string> = {
    'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'FEDEX': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
  };
  return carrierUrls[carrier.toUpperCase()] || null;
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const isCancelled = order.status === 'CANCELLED';
  const currentStatusIndex = getStatusIndex(order.status);

  if (isCancelled) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Order Status</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-xl font-semibold text-red-600">Order Cancelled</p>
            {order.cancelledAt && (
              <p className="text-sm text-gray-500 mt-2">
                Cancelled on {formatDate(order.cancelledAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Order Tracking</h2>

      {/* Tracking Number & Carrier */}
      {order.trackingNumber && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tracking Number</p>
              <p className="font-mono font-semibold text-blue-600">
                {order.trackingNumber}
              </p>
            </div>
            {order.shippingCarrier && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Carrier</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{order.shippingCarrier}</p>
                  {getCarrierTrackingUrl(order.shippingCarrier, order.trackingNumber) && (
                    <a
                      href={getCarrierTrackingUrl(order.shippingCarrier, order.trackingNumber)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      {order.estimatedDeliveryDate && order.status !== 'DELIVERED' && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Estimated Delivery</p>
          <p className="font-semibold text-green-700">
            {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {trackingSteps.map((step, index) => {
          const stepIndex = getStatusIndex(step.status);
          const isCompleted = stepIndex <= currentStatusIndex;
          const isCurrent = step.status === order.status;
          const timestamp = getStatusTimestamp(order, step.status);
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex gap-4 relative">
              {/* Connector Line */}
              {index < trackingSteps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${
                    stepIndex < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                  isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className={`pb-8 ${index === trackingSteps.length - 1 ? 'pb-0' : ''}`}>
                <p
                  className={`font-semibold ${
                    isCurrent
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                  {isCurrent && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </p>
                <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
                {timestamp && isCompleted && (
                  <p className="text-xs text-gray-500 mt-1">{formatDate(timestamp)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
