import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-9 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
      <div className="flex gap-4 mb-6">
        <div className="h-10 bg-gray-200 rounded w-96 animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse" />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
