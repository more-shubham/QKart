import Link from 'next/link';
import { fetchHomePageData } from '@/services/api';
import { ProductGrid } from '@/components/products/ProductGrid';
import { AlbumCarousel } from '@/components/qtify/AlbumCarousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let data;
  try {
    data = await fetchHomePageData();
  } catch (error) {
    // Fallback for when backend is not running
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to QKart</h1>
        <p className="text-gray-600 mb-8">
          Start the backend server to see products and music.
        </p>
        <code className="bg-gray-100 px-4 py-2 rounded">
          cd backend && ./mvnw spring-boot:run
        </code>
      </div>
    );
  }

  const { products, featuredAlbums, topAlbums } = data;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to QKart
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover amazing products and stream your favorite music all in one place
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/qtify"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Music
            </Link>
          </div>
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

      {/* QTify Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">QTify Music</h2>
            <Link
              href="/qtify"
              className="text-green-500 font-medium hover:underline"
            >
              Explore Music →
            </Link>
          </div>
          <AlbumCarousel title="Featured Albums" albums={featuredAlbums} showCollapse={false} />
          <AlbumCarousel title="Top Charts" albums={topAlbums} showCollapse={false} />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Music Streaming</h3>
            <p className="text-gray-600">
              Stream millions of songs with QTify integration
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
