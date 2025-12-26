import { fetchProductsAndCategories } from '@/services/api';
import { ProductsPage } from '@/components/products/ProductsPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products - QKart',
  description: 'Browse our collection of products',
};

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
      <ProductsPage products={data.products} categories={data.categories} />
    </div>
  );
}
