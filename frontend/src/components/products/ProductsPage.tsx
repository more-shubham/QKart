'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, ProductSearchCriteria, ProductSearchResponse } from '@/types';
import { SearchBar } from './SearchBar';
import { ProductFilters } from './ProductFilters';
import { SortDropdown } from './SortDropdown';
import { ProductGrid } from './ProductGrid';
import { api } from '@/services/api';

interface ProductsPageProps {
  products: Product[];
  categories: string[];
}

export function ProductsPage({ products: initialProducts, categories }: ProductsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [totalElements, setTotalElements] = useState(initialProducts.length);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  // Parse criteria from URL
  const criteria = useMemo<ProductSearchCriteria>(() => {
    const query = searchParams.get('q') || undefined;
    const categoriesParam = searchParams.get('categories');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') as ProductSearchCriteria['sortBy'];
    const sortOrder = searchParams.get('sortOrder') as ProductSearchCriteria['sortOrder'];
    const page = searchParams.get('page');

    return {
      query,
      categories: categoriesParam ? categoriesParam.split(',') : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      inStock: inStock !== null ? inStock === 'true' : undefined,
      sortBy: sortBy || 'name',
      sortOrder: sortOrder || 'asc',
      page: page ? Number(page) : 0,
      size: 12,
    };
  }, [searchParams]);

  // Update URL with criteria
  const updateUrl = useCallback((newCriteria: ProductSearchCriteria) => {
    const params = new URLSearchParams();

    if (newCriteria.query) params.set('q', newCriteria.query);
    if (newCriteria.categories?.length) params.set('categories', newCriteria.categories.join(','));
    if (newCriteria.minPrice !== undefined) params.set('minPrice', String(newCriteria.minPrice));
    if (newCriteria.maxPrice !== undefined) params.set('maxPrice', String(newCriteria.maxPrice));
    if (newCriteria.minRating !== undefined) params.set('minRating', String(newCriteria.minRating));
    if (newCriteria.inStock !== undefined) params.set('inStock', String(newCriteria.inStock));
    if (newCriteria.sortBy) params.set('sortBy', newCriteria.sortBy);
    if (newCriteria.sortOrder) params.set('sortOrder', newCriteria.sortOrder);
    if (newCriteria.page && newCriteria.page > 0) params.set('page', String(newCriteria.page));

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products', { scroll: false });
  }, [router]);

  // Fetch products with criteria
  const fetchProducts = useCallback(async (searchCriteria: ProductSearchCriteria) => {
    // If no filters applied, use initial products
    const hasFilters =
      searchCriteria.query ||
      searchCriteria.categories?.length ||
      searchCriteria.minPrice !== undefined ||
      searchCriteria.maxPrice !== undefined ||
      searchCriteria.minRating !== undefined ||
      searchCriteria.inStock !== undefined;

    if (!hasFilters && searchCriteria.page === 0) {
      // Apply client-side sorting to initial products
      let sorted = [...initialProducts];
      if (searchCriteria.sortBy) {
        sorted.sort((a, b) => {
          let comparison = 0;
          switch (searchCriteria.sortBy) {
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'rating':
              comparison = b.rating - a.rating;
              break;
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            default:
              comparison = a.name.localeCompare(b.name);
          }
          return searchCriteria.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      setProducts(sorted);
      setTotalElements(sorted.length);
      setTotalPages(1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.searchWithFilters(searchCriteria);
      setProducts(response.products);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initialProducts]);

  // Fetch price range on mount
  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const range = await api.getPriceRange();
        setPriceRange(range);
      } catch (error) {
        console.error('Failed to fetch price range:', error);
        // Calculate from initial products
        if (initialProducts.length > 0) {
          const prices = initialProducts.map(p => p.price);
          setPriceRange({
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
          });
        }
      }
    };
    fetchPriceRange();
  }, [initialProducts]);

  // Fetch products when criteria changes
  useEffect(() => {
    fetchProducts(criteria);
  }, [criteria, fetchProducts]);

  const handleSearch = (query: string) => {
    updateUrl({ ...criteria, query: query || undefined, page: 0 });
  };

  const handleCriteriaChange = (newCriteria: ProductSearchCriteria) => {
    updateUrl(newCriteria);
  };

  const handleSortChange = (
    sortBy: ProductSearchCriteria['sortBy'],
    sortOrder: ProductSearchCriteria['sortOrder']
  ) => {
    updateUrl({ ...criteria, sortBy, sortOrder, page: 0 });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ ...criteria, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:w-64 flex-shrink-0">
        <ProductFilters
          categories={categories}
          priceRange={priceRange}
          criteria={criteria}
          onCriteriaChange={handleCriteriaChange}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <SearchBar initialQuery={criteria.query} onSearch={handleSearch} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {totalElements} product{totalElements !== 1 ? 's' : ''}
            </span>
            <SortDropdown
              sortBy={criteria.sortBy}
              sortOrder={criteria.sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <ProductGrid products={products} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 rounded-lg ${
                        i === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )).slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 3)
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
