import { Suspense } from 'react';
import { fetchProductsAndCategories } from '@/services/api';
import { ProductsPage } from '@/components/products/ProductsPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products - QKart',
  description: 'Browse our collection of products',
};

function ProductsLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-6 bg-gray-200 rounded w-24 mt-6"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductsRoute() {
  let data;
  try {
    data = await fetchProductsAndCategories();
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Unable to load products</h1>
        <p className="text-gray-600">Please ensure the backend server is running.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <Suspense fallback={<ProductsLoading />}>
        <ProductsPage products={data.products} categories={data.categories} />
      </Suspense>
    </div>
  );
}
