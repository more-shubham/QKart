'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface TopProduct {
  id: number;
  name: string;
  imageUrl: string;
  totalSales: number;
  revenue: number;
  category: string;
}

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  const maxSales = Math.max(...products.map((p) => p.totalSales));

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
          </div>
          <Link
            href="/admin/analytics/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Report
          </Link>
        </div>
      </div>

      <div className="divide-y">
        {products.map((product, index) => {
          const percentage = (product.totalSales / maxSales) * 100;
          return (
            <div key={product.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {index + 1}
                </div>
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{product.totalSales} sold</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 ml-12">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="p-8 text-center text-gray-500">No sales data available</div>
      )}
    </div>
  );
}
