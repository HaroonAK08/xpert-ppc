import type { Metadata } from 'next';
import Link from 'next/link';

import { CourseAuthForm } from '@/components/courses/auth-forms';

export const metadata: Metadata = {
  title: 'Sign in | Courses',
  robots: { index: false, follow: false },
};

export default function CourseLoginPage() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-8">
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Sign in</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Use your course account email and password to open the portal.
          </p>
          <CourseAuthForm mode="login" />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/courses" className="hover:text-primary">
              Back to courses
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
