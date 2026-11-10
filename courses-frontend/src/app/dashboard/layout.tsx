'use client';

import { StudentGuard } from '@/lib/student-context';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
      <div className="flex min-h-dvh flex-col bg-canvas lg:flex-row">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </StudentGuard>
  );
}
