'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';

export function Header() {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors">
            QKart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-200 transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-200 transition-colors font-medium">
              Products
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="hover:text-blue-200 transition-colors font-medium">
                Orders
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <HeartIcon className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
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

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden md:inline font-medium">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="hover:text-blue-200 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:text-blue-200 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    className="hover:text-blue-200 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/profile"
                    className="hover:text-blue-200 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left hover:text-blue-200 transition-colors font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:text-blue-200 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="hover:text-blue-200 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
