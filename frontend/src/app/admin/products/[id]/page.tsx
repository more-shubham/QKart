'use client';

import { useState, useEffect, use } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm';
import { Product } from '@/types';
import { api } from '@/services/api';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await api.getProductById(parseInt(resolvedParams.id));
        setProduct(data);
      } catch {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  const handleSubmit = async (data: ProductFormData) => {
    // In production, this would call the API to update the product
    console.log('Updating product:', resolvedParams.id, data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            {error || 'Product not found'}
          </h2>
          <Link
            href="/admin/products"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 mt-1">
            Update product information for: {product.name}
          </p>
        </div>

        <ProductForm product={product} onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
}
