'use client';

import { useState } from 'react';

interface SalesData {
  label: string;
  value: number;
}

interface SalesChartProps {
  data: SalesData[];
  title: string;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function SalesChart({ data, title }: SalesChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="h-64 flex items-end gap-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-12 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors cursor-pointer group"
                  style={{ height: `${height * 2}px` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.value.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm">
        <div>
          <span className="text-gray-500">Total Sales:</span>
          <span className="ml-2 font-semibold text-gray-900">
            ${data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Average:</span>
          <span className="ml-2 font-semibold text-gray-900">
            ${Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
