'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, MagnifyingGlassIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

export function Header() {
  const { cart } = useCart();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors">
            QKart
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:text-blue-200 transition-colors font-medium">
              Products
            </Link>
            <Link href="/qtify" className="flex items-center gap-2 hover:text-blue-200 transition-colors font-medium">
              <MusicalNoteIcon className="w-5 h-5" />
              QTify
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
