'use client';

import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/lib/admin-context';
import { AdminShell } from '@/components/admin/shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return children;
  }

  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
