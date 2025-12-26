'use client';

import { useState, useCallback, useMemo } from 'react';
import { Product } from '@/types';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { ProductGrid } from './ProductGrid';

interface ProductsPageProps {
  products: Product[];
  categories: string[];
}

export function ProductsPage({ products, categories }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-96">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
