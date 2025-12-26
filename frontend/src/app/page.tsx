import Link from 'next/link';
import { fetchProducts } from '@/services/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { RecommendationSection } from '@/components/recommendations';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  try {
    products = await fetchProducts();
  } catch (error) {
    // Fallback for when backend is not running
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to QKart</h1>
        <p className="text-gray-600 mb-8">
          Start the backend server to see products.
        </p>
        <code className="bg-gray-100 px-4 py-2 rounded">
          cd backend && mvn spring-boot:run
        </code>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to QKart
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover amazing products at great prices
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/products"
            className="text-blue-600 font-medium hover:underline"
          >
            View All →
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>

      {/* Personalized Recommendations */}
      <section className="container mx-auto px-4 py-8">
        <RecommendationSection />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose QKart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
            <p className="text-gray-600">
              Curated selection of premium products at great prices
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Great Prices</h3>
            <p className="text-gray-600">
              Competitive pricing on all products
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable shipping to your doorstep
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
