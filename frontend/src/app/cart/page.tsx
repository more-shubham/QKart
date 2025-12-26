import { CartPage } from '@/components/cart/CartPage';

export const metadata = {
  title: 'Shopping Cart - QKart',
  description: 'View your shopping cart',
};

export default function CartRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CartPage />
    </div>
  );
}
