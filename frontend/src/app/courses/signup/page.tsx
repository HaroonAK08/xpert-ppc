import type { Metadata } from 'next';
import Link from 'next/link';

import { CourseAuthForm } from '@/components/courses/auth-forms';

export const metadata: Metadata = {
  title: 'Apply | Courses',
  robots: { index: false, follow: false },
};

export default function CourseSignupPage() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-8">
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Apply for courses</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Tell us your name, email, and what you want to learn. If we accept you, sign in with the
            password you set here.
          </p>
          <CourseAuthForm mode="signup" />
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
