'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateQuantity(item.productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`flex gap-4 p-4 bg-white rounded-lg shadow-sm ${isUpdating ? 'opacity-50' : ''}`}>
      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.productName}</h3>
        <p className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)} each</p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="px-4 py-1 font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">${item.subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
