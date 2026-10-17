'use client';

import { StudentGuard } from '@/lib/student-context';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentGuard>
      <div className="flex min-h-dvh bg-canvas">
        <DashboardSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </StudentGuard>
  );
}
