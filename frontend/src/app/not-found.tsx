import Link from 'next/link';
import { Button } from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
