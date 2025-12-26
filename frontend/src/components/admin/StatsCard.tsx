'use client';

import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
  iconBgColor: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  iconBgColor,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive && (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              )}
              {isNegative && (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? 'text-green-600'
                    : isNegative
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {Math.abs(change)}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
