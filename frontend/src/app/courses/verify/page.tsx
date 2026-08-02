import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CourseOtpForm } from '@/components/courses/auth-forms';

export const metadata: Metadata = {
  title: 'Verify email | Courses',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ email?: string; purpose?: string }>;
};

export default async function CourseVerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = (params.email || '').trim().toLowerCase();
  const purpose = params.purpose === 'login' ? 'login' : 'signup';

  if (!email) redirect('/courses/signup');

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-8">
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Verify your email</h1>
          <div className="mb-8">
            <CourseOtpForm email={email} purpose={purpose} />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Wrong email?{' '}
            <Link
              href={purpose === 'login' ? '/courses/login' : '/courses/signup'}
              className="text-primary hover:underline"
            >
              Start over
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
