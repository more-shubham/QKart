import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">QKart</h3>
            <p className="text-sm">
              Your one-stop shop for all things amazing. Quality products at great prices.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=Clothing" className="hover:text-white transition-colors">Clothing</Link></li>
              <li><Link href="/products?category=Footwear" className="hover:text-white transition-colors">Footwear</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">QTify</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/qtify" className="hover:text-white transition-colors">Browse Music</Link></li>
              <li><Link href="/qtify?section=featured" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link href="/qtify?section=top" className="hover:text-white transition-colors">Top Charts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} QKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
