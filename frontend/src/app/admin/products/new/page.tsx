'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProductPage() {
  const handleSubmit = async (data: ProductFormData) => {
    // In production, this would call the API to create the product
    console.log('Creating product:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-1">
            Create a new product for your catalog
          </p>
        </div>

        <ProductForm onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  );
}
