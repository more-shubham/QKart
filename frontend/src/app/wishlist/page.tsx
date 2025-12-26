'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/common/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  StarIcon,
} from '@heroicons/react/24/solid';

function WishlistContent() {
  const router = useRouter();
  const { wishlist, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movingToCart, setMovingToCart] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  const handleMoveToCart = async (item: typeof wishlist[0]) => {
    setMovingToCart(item.productId);
    try {
      await addToCart({ productId: item.productId, quantity: 1 });
      await removeFromWishlist(item.productId);
    } catch (error) {
      console.error('Failed to move to cart:', error);
    } finally {
      setMovingToCart(null);
    }
  };

  const handleRemove = async (productId: number) => {
    setRemoving(productId);
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setRemoving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-16">
        <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-8">
          Start adding products you love to your wishlist
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Wishlist ({wishlist.length} items)
        </h1>
        <button
          onClick={clearWishlist}
          className="text-red-600 hover:text-red-700 font-medium flex items-center"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Clear All
        </button>
      </div>

      <div className="grid gap-4">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
          >
            {/* Product Image */}
            <Link href={`/products/${item.productId}`} className="flex-shrink-0">
              <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.productId}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate">
                  {item.productName}
                </h3>
              </Link>

              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-4">
                <span className="text-xl font-bold text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
                {item.stock > 0 ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Added on {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 sm:justify-center">
              <Button
                onClick={() => handleMoveToCart(item)}
                disabled={item.stock === 0 || movingToCart === item.productId}
                loading={movingToCart === item.productId}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <ShoppingCartIcon className="w-4 h-4 mr-1" />
                Move to Cart
              </Button>
              <button
                onClick={() => handleRemove(item.productId)}
                disabled={removing === item.productId}
                className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
              >
                {removing === item.productId ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <WishlistContent />
      </div>
    </ProtectedRoute>
  );
}
