import {
  Product,
  Cart,
  Order,
  Address,
  Album,
  Song,
  AddToCartRequest,
  CheckoutRequest,
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

  // QTify - Albums
  async getAlbums(): Promise<Album[]> {
    return this.fetch<Album[]>('/albums');
  }

  async getAlbumById(id: number): Promise<Album> {
    return this.fetch<Album>(`/albums/${id}`);
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    return this.fetch<Album[]>('/albums/featured');
  }

  async getTopAlbums(): Promise<Album[]> {
    return this.fetch<Album[]>('/albums/top');
  }

  async getAlbumsByGenre(genre: string): Promise<Album[]> {
    return this.fetch<Album[]>(`/albums/genre/${genre}`);
  }

  async searchAlbums(query: string): Promise<Album[]> {
    return this.fetch<Album[]>(`/albums/search?q=${encodeURIComponent(query)}`);
  }

  async getGenres(): Promise<string[]> {
    return this.fetch<string[]>('/albums/genres');
  }

  // QTify - Songs
  async getSongsByAlbum(albumId: number): Promise<Song[]> {
    return this.fetch<Song[]>(`/albums/${albumId}/songs`);
  }

  async getTopSongs(): Promise<Song[]> {
    return this.fetch<Song[]>('/albums/songs/top');
  }

  async searchSongs(query: string): Promise<Song[]> {
    return this.fetch<Song[]>(`/albums/songs/search?q=${encodeURIComponent(query)}`);
  }
}

export const api = new ApiService();

// Parallel API calls using Promise combinators
export async function fetchHomePageData() {
  const [products, categories, featuredAlbums, topAlbums] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
    api.getFeaturedAlbums(),
    api.getTopAlbums(),
  ]);

  return { products, categories, featuredAlbums, topAlbums };
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

export async function fetchQTifyData() {
  const [featuredAlbums, topAlbums, topSongs, genres] = await Promise.all([
    api.getFeaturedAlbums(),
    api.getTopAlbums(),
    api.getTopSongs(),
    api.getGenres(),
  ]);

  return { featuredAlbums, topAlbums, topSongs, genres };
}
