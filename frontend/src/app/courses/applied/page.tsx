import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Application received | Courses',
  robots: { index: false, follow: false },
};

export default function CourseAppliedPage() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center sm:p-8">
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Application received</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            We’ll review it and email you if you’re accepted. After that you can sign in with the
            password you just created.
          </p>
          <Link
            href="/courses/login"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
