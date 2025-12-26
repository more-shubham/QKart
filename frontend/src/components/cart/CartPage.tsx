'use client';

import { useCart } from '@/context/CartContext';
import { CartItemComponent } from './CartItem';
import { CartSummary } from './CartSummary';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

export function CartPage() {
  const { cart, loading, error } = useCart();

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load cart. Please try again.</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        {cart.items.map((item) => (
          <CartItemComponent key={item.id} item={item} />
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
