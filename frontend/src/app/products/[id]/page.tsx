import { api } from '@/services/api';
import { ProductDetails } from '@/components/products/ProductDetails';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await api.getProductById(Number(id));
    return {
      title: `${product.name} - QKart`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Product Not Found - QKart',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  let product;
  let relatedProducts;

  try {
    product = await api.getProductById(productId);
    // Get related products from same category
    const categoryProducts = await api.getProductsByCategory(product.category);
    relatedProducts = categoryProducts.filter(p => p.id !== productId).slice(0, 4);
  } catch {
    notFound();
  }

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}
