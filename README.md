# QKart - E-commerce & Music Streaming Platform

A full-stack application with Spring Boot backend and Next.js frontend, featuring:
- **QKart**: E-commerce shopping experience with products, cart, and checkout
- **QTify**: Spotify-like music streaming interface

## Project Structure

```
QKart/
├── backend/          # Spring Boot API
│   ├── src/main/java/com/qkart/
│   │   ├── controller/  # REST Controllers
│   │   ├── service/     # Business Logic
│   │   ├── repository/  # Data Access
│   │   ├── model/       # Entity Models
│   │   ├── dto/         # Data Transfer Objects
│   │   └── config/      # Configuration
│   └── pom.xml
│
└── frontend/         # Next.js Application
    ├── src/
    │   ├── app/         # App Router Pages
    │   ├── components/  # React Components
    │   ├── hooks/       # Custom React Hooks
    │   ├── services/    # API Services
    │   ├── context/     # React Context
    │   └── types/       # TypeScript Types
    └── package.json
```

## Features

### QKart (E-commerce)
- **Products Page**: Browse products with category filtering
- **Search with Debouncing**: Optimized search functionality
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Address management and order placement

### QTify (Music Streaming)
- **Featured Albums**: Curated music collections
- **Genre Filtering**: Browse by music genre
- **Top Charts**: Popular albums and songs
- **Search**: Find albums and songs

### Technical Highlights
- **Custom React Hooks**: `useDebounce`, `useFetch`, `useAsync`, `useLocalStorage`, `useToggle`
- **Promise Combinators**: Parallel API calls with `Promise.all`
- **React Context**: Global cart state management
- **TypeScript**: Full type safety across the frontend

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- npm

### Running the Backend

```bash
cd backend

# Using Maven (if installed)
mvn spring-boot:run

# Or using Maven Wrapper
./mvnw spring-boot:run
```

The backend will start at http://localhost:8080

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at http://localhost:3000

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/categories` - Get all categories

### Cart
- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart/{userId}/add` - Add item to cart
- `PUT /api/cart/{userId}/items/{productId}` - Update quantity
- `DELETE /api/cart/{userId}/items/{productId}` - Remove item

### Orders
- `POST /api/orders/checkout` - Place order
- `GET /api/orders/user/{userId}` - Get user's orders

### Albums (QTify)
- `GET /api/albums` - Get all albums
- `GET /api/albums/featured` - Get featured albums
- `GET /api/albums/top` - Get top albums
- `GET /api/albums/search?q={query}` - Search albums

## Tech Stack

### Backend
- Spring Boot 3.2
- Spring Data JPA
- H2 Database (in-memory)
- Lombok

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Heroicons
