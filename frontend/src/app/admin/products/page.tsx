'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductTable } from '@/components/admin/ProductTable';
import { Product } from '@/types';
import { api } from '@/services/api';
import { PageLoader } from '@/components/common/LoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleDelete = async (ids: number[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} product(s)?`)) {
      return;
    }
    // In production, this would call the API
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
  };

  const handleStatusChange = async (ids: number[], status: string) => {
    console.log('Status change:', ids, status);
    // In production, this would call the API
  };

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>

        <ProductTable
          products={products}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </AdminLayout>
  );
}
