'use client';

import { useEffect } from 'react';
import { Button } from '@/components/common/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-500 mb-6">We encountered an error while loading this page.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
