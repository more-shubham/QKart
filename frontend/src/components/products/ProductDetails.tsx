'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/common/Button';
import { ProductCard } from './ProductCard';
import { ProductReviews } from '@/components/reviews/ProductReviews';
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const isWishlisted = isInWishlist(product.id);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({ productId: product.id, quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    setIsWishlistLoading(true);
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out ${product.name} on QKart!`;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setShowShareMenu(false);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const stockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    } else if (product.stock < 10) {
      return { text: `Only ${product.stock} left in stock`, color: 'text-orange-600', bg: 'bg-orange-50' };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
    }
  };

  const status = stockStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        <Link href={`/products?category=${product.category}`} className="hover:text-blue-600">
          {product.category}
        </Link>
        <ChevronRightIcon className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div
            className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleImageMouseMove}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white text-lg font-bold px-6 py-2 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">Hover over image to zoom</p>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Title */}
          <div>
            <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${status.bg}`}>
            {product.stock > 0 ? (
              <CheckIcon className={`w-4 h-4 mr-1.5 ${status.color}`} />
            ) : (
              <XMarkIcon className={`w-4 h-4 mr-1.5 ${status.color}`} />
            )}
            <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-5 h-5 text-gray-600" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              loading={isAdding}
              size="lg"
              className="flex-1"
              variant={added ? 'secondary' : 'primary'}
            >
              {added ? (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            <button
              onClick={handleWishlist}
              disabled={isWishlistLoading}
              className={`px-6 py-3 border-2 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              {isWishlistLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isWishlisted ? (
                <HeartIcon className="w-5 h-5 mr-2 text-red-500" />
              ) : (
                <HeartOutlineIcon className="w-5 h-5 mr-2" />
              )}
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share this product
            </button>

            {showShareMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 w-48">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span className="mr-3">𝕏</span> Twitter
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span className="mr-3">f</span> Facebook
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span className="mr-3">💬</span> WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span className="mr-3">📋</span> Copy Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                <ProductCard product={relatedProduct} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
