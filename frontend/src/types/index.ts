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
  totalAmount: number;
  status: string;
  createdAt: string;
}

// QTify types
export interface Song {
  id: number;
  title: string;
  artist: string;
  durationSeconds: number;
  audioUrl: string;
  trackNumber: number;
  plays: number;
  albumId: number;
  albumTitle: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  genre: string;
  likes: number;
  rating: number;
  isFeatured: boolean;
  songs?: Song[];
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
}
