'use client';

import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/lib/admin-context';
import { AdminShell } from '@/components/admin/shell';

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') return children;

  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
