import {
  Product,
  Cart,
  Order,
  Address,
  AddToCartRequest,
  CheckoutRequest,
  AuthResponse,
  ProductSearchCriteria,
  ProductSearchResponse,
  WishlistItem,
  Review,
  ProductRatingSummary,
  CreateReviewRequest,
  ReviewsPage,
  CreatePaymentRequest,
  PaymentResponse,
  ApplyCouponRequest,
  CouponValidationResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

class ApiService {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.fetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.fetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.fetch<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.fetch<Product[]>('/products');
  }

  async getProductById(id: number): Promise<Product> {
    return this.fetch<Product>(`/products/${id}`);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.fetch<Product[]>(`/products/category/${category}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.fetch<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getCategories(): Promise<string[]> {
    return this.fetch<string[]>('/products/categories');
  }

  async searchWithFilters(criteria: ProductSearchCriteria): Promise<ProductSearchResponse> {
    return this.fetch<ProductSearchResponse>('/products/search', {
      method: 'POST',
      body: JSON.stringify(criteria),
    });
  }

  async getSuggestions(query: string): Promise<string[]> {
    return this.fetch<string[]>(`/products/suggestions?q=${encodeURIComponent(query)}`);
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    return this.fetch<{ min: number; max: number }>('/products/price-range');
  }

  // Cart
  async getCart(userId: number): Promise<Cart> {
    return this.fetch<Cart>(`/cart/${userId}`);
  }

  async addToCart(userId: number, request: AddToCartRequest): Promise<Cart> {
    return this.fetch<Cart>(`/cart/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateCartItem(userId: number, productId: number, quantity: number): Promise<Cart> {
    return this.fetch<Cart>(`/cart/${userId}/items/${productId}?quantity=${quantity}`, {
      method: 'PUT',
    });
  }

  async removeFromCart(userId: number, productId: number): Promise<Cart> {
    return this.fetch<Cart>(`/cart/${userId}/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(userId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
    });
  }

  // Orders
  async checkout(request: CheckoutRequest): Promise<Order> {
    return this.fetch<Order>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.fetch<Order[]>(`/orders/user/${userId}`);
  }

  async getOrderById(orderId: number): Promise<Order> {
    return this.fetch<Order>(`/orders/${orderId}`);
  }

  // User Addresses
  async getUserAddresses(userId: number): Promise<Address[]> {
    return this.fetch<Address[]>(`/users/${userId}/addresses`);
  }

  async addAddress(userId: number, address: Address): Promise<Address> {
    return this.fetch<Address>(`/users/${userId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  // Wishlist
  async getWishlist(userId: number): Promise<WishlistItem[]> {
    return this.fetch<WishlistItem[]>(`/wishlist/${userId}`);
  }

  async addToWishlist(userId: number, productId: number): Promise<WishlistItem> {
    return this.fetch<WishlistItem>(`/wishlist/${userId}/add/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/wishlist/${userId}/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const result = await this.fetch<{ inWishlist: boolean }>(`/wishlist/${userId}/check/${productId}`);
    return result.inWishlist;
  }

  async clearWishlist(userId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/wishlist/${userId}/clear`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getProductReviews(
    productId: number,
    sortBy: string = 'newest',
    page: number = 0,
    size: number = 10
  ): Promise<ReviewsPage> {
    return this.fetch<ReviewsPage>(
      `/reviews/product/${productId}?sortBy=${sortBy}&page=${page}&size=${size}`
    );
  }

  async getProductRatingSummary(productId: number): Promise<ProductRatingSummary> {
    return this.fetch<ProductRatingSummary>(`/reviews/product/${productId}/summary`);
  }

  async createReview(userId: number, request: CreateReviewRequest): Promise<Review> {
    return this.fetch<Review>(`/reviews/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateReview(userId: number, reviewId: number, request: CreateReviewRequest): Promise<Review> {
    return this.fetch<Review>(`/reviews/user/${userId}/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async deleteReview(userId: number, reviewId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/reviews/user/${userId}/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async markReviewHelpful(reviewId: number): Promise<void> {
    await this.fetch(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  }

  // Payments
  async createPaymentIntent(request: CreatePaymentRequest): Promise<PaymentResponse> {
    return this.fetch<PaymentResponse>('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentResponse> {
    return this.fetch<PaymentResponse>(`/payments/status/${paymentIntentId}`);
  }

  // Coupons
  async validateCoupon(request: ApplyCouponRequest): Promise<CouponValidationResponse> {
    return this.fetch<CouponValidationResponse>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async applyCoupon(request: ApplyCouponRequest): Promise<CouponValidationResponse> {
    return this.fetch<CouponValidationResponse>('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const api = new ApiService();

// Parallel API calls using Promise combinators
export async function fetchProducts() {
  return api.getProducts();
}

export async function fetchProductsAndCategories() {
  const [products, categories] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
  ]);

  return { products, categories };
}

export async function fetchCheckoutData(userId: number) {
  const [cart, addresses] = await Promise.all([
    api.getCart(userId),
    api.getUserAddresses(userId),
  ]);

  return { cart, addresses };
}
