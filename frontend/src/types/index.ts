// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Address types
export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Order types
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  couponCode?: string;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod?: string;
  status: OrderStatus;
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

// Auth types
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

// Payment types
export interface CreatePaymentRequest {
  userId: number;
  amount: number;
  currency?: string;
  orderId?: number;
}

export interface PaymentResponse {
  id: number;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

// Review types
export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ProductRatingSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  title?: string;
  comment?: string;
}

export interface ReviewsPage {
  content: Review[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Wishlist types
export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  stock: number;
  rating: number;
  addedAt: string;
}

// Search types
export interface ProductSearchCriteria {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'newest' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Request types
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CheckoutRequest {
  userId: number;
  shippingAddressId: number;
  paymentMethod?: string;
  couponCode?: string;
}

// Coupon types
export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  timesUsed: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  valid: boolean;
}

export interface ApplyCouponRequest {
  code: string;
  userId: number;
  orderAmount: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
  code?: string;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
}
