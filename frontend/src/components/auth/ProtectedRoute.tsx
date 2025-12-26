'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?redirect=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, requireAuth, router, pathname, redirectTo]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// HOC for wrapping page components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute redirectTo={options?.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
