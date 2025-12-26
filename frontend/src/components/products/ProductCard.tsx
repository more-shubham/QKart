'use client';

import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/common/Button';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center mt-3">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-sm text-gray-500">
            {product.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            loading={isAdding}
            size="sm"
            variant={added ? 'secondary' : 'primary'}
          >
            {added ? (
              'Added!'
            ) : (
              <>
                <ShoppingCartIcon className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
