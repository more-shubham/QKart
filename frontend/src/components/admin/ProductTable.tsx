'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface ProductTableProps {
  products: Product[];
  onDelete?: (ids: number[]) => void;
  onStatusChange?: (ids: number[], status: string) => void;
}

type SortField = 'name' | 'price' | 'stock' | 'category';
type SortOrder = 'asc' | 'desc';

export function ProductTable({ products, onDelete, onStatusChange }: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('');

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStock =
      !stockFilter ||
      (stockFilter === 'in-stock' && product.stock > 10) ||
      (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === 'out-of-stock' && product.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = a.stock - b.stock;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedProducts.map((p) => p.id));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (onDelete && selectedIds.length > 0) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedIds.length} item(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              Delete Selected
            </button>
            <button
              onClick={() => onStatusChange?.(selectedIds, 'draft')}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              Mark as Draft
            </button>
            <button
              onClick={() => onStatusChange?.(selectedIds, 'published')}
              className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
            >
              Publish
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === sortedProducts.length && sortedProducts.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-1">
                  Price
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center gap-1">
                  Stock
                  <ChevronUpDownIcon className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelect(product.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => onDelete?.([product.id])}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedProducts.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {searchQuery || categoryFilter || stockFilter
            ? 'No products match your filters'
            : 'No products found'}
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
        <span>Showing {sortedProducts.length} of {products.length} products</span>
      </div>
    </div>
  );
}
