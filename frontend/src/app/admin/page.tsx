'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { LowStockAlerts } from '@/components/admin/LowStockAlerts';
import { TopProducts } from '@/components/admin/TopProducts';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// Mock data - would come from API in production
const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: CurrencyDollarIcon,
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-100',
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: 8.2,
    changeLabel: 'vs last month',
    icon: ShoppingCartIcon,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-100',
  },
  {
    title: 'Products',
    value: '156',
    change: 3.1,
    changeLabel: 'new this month',
    icon: CubeIcon,
    iconColor: 'text-purple-600',
    iconBgColor: 'bg-purple-100',
  },
  {
    title: 'Customers',
    value: '2,845',
    change: 15.3,
    changeLabel: 'vs last month',
    icon: UsersIcon,
    iconColor: 'text-orange-600',
    iconBgColor: 'bg-orange-100',
  },
];

const salesData = [
  { label: 'Mon', value: 4200 },
  { label: 'Tue', value: 3800 },
  { label: 'Wed', value: 5100 },
  { label: 'Thu', value: 4700 },
  { label: 'Fri', value: 6200 },
  { label: 'Sat', value: 7500 },
  { label: 'Sun', value: 5800 },
];

const recentOrders = [
  {
    id: 1001,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    totalAmount: 299.99,
    status: 'CONFIRMED' as const,
    createdAt: new Date().toISOString(),
    itemCount: 3,
  },
  {
    id: 1002,
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    totalAmount: 149.50,
    status: 'SHIPPED' as const,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    itemCount: 2,
  },
  {
    id: 1003,
    customerName: 'Bob Wilson',
    customerEmail: 'bob@example.com',
    totalAmount: 89.99,
    status: 'PENDING' as const,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    itemCount: 1,
  },
  {
    id: 1004,
    customerName: 'Alice Brown',
    customerEmail: 'alice@example.com',
    totalAmount: 450.00,
    status: 'DELIVERED' as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    itemCount: 5,
  },
  {
    id: 1005,
    customerName: 'Charlie Davis',
    customerEmail: 'charlie@example.com',
    totalAmount: 75.25,
    status: 'PROCESSING' as const,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    itemCount: 2,
  },
];

const lowStockProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    stock: 0,
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Premium Leather Wallet',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100',
    stock: 3,
    category: 'Accessories',
  },
  {
    id: 3,
    name: 'Smart Watch Pro',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
    stock: 5,
    category: 'Electronics',
  },
  {
    id: 4,
    name: 'Running Shoes Elite',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
    stock: 8,
    category: 'Footwear',
  },
];

const topProducts = [
  {
    id: 1,
    name: 'Wireless Earbuds Pro',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
    totalSales: 245,
    revenue: 24500,
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Home Hub',
    imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=100',
    totalSales: 189,
    revenue: 18900,
    category: 'Smart Home',
  },
  {
    id: 3,
    name: 'Fitness Tracker Band',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100',
    totalSales: 156,
    revenue: 7800,
    category: 'Wearables',
  },
  {
    id: 4,
    name: 'Portable Charger 20000mAh',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100',
    totalSales: 134,
    revenue: 5360,
    category: 'Electronics',
  },
  {
    id: 5,
    name: 'Bluetooth Speaker Mini',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100',
    totalSales: 121,
    revenue: 4840,
    category: 'Electronics',
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Sales Chart */}
        <SalesChart data={salesData} title="Sales Overview" />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LowStockAlerts products={lowStockProducts} />
          <TopProducts products={topProducts} />
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={recentOrders} />
      </div>
    </AdminLayout>
  );
}
