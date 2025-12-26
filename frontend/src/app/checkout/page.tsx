import { CheckoutPage } from '@/components/checkout/CheckoutPage';

export const metadata = {
  title: 'Checkout - QKart',
  description: 'Complete your order',
};

export default function CheckoutRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutPage />
    </div>
  );
}
