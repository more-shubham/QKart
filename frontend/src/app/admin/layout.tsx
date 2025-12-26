import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - QKart',
  description: 'QKart Admin Dashboard',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
