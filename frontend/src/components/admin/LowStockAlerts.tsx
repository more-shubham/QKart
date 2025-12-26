'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface LowStockProduct {
  id: number;
  name: string;
  imageUrl: string;
  stock: number;
  category: string;
}

interface LowStockAlertsProps {
  products: LowStockProduct[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const getStockLevel = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (stock <= 5) return { label: 'Critical', color: 'text-orange-600 bg-orange-50' };
    return { label: 'Low', color: 'text-yellow-600 bg-yellow-50' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
          </div>
          <Link
            href="/admin/products?filter=low-stock"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y">
        {products.map((product) => {
          const stockLevel = getStockLevel(product.stock);
          return (
            <div
              key={product.id}
              className="p-4 flex items-center gap-4 hover:bg-gray-50"
            >
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
                <span
                  className={`inline-flex px-2 py-1 rounded text-xs font-medium ${stockLevel.color}`}
                >
                  {product.stock} left
                </span>
                <p className="text-xs text-gray-500 mt-1">{stockLevel.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          All products are well stocked
        </div>
      )}
    </div>
  );
}
