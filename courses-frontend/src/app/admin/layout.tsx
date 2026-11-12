import type { Metadata } from 'next';
import { AdminLayoutContent } from '@/components/admin/layout-content';

export const metadata: Metadata = {
  title: 'Academy Admin',
  manifest: '/academy-admin.webmanifest',
  appleWebApp: { capable: true, title: 'Academy Admin', statusBarStyle: 'default' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
