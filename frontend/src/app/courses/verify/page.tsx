'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { CourseOtpForm } from '@/components/courses/auth-forms';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get('email') || '').trim().toLowerCase();
  const purpose = searchParams.get('purpose') === 'login' ? 'login' : 'signup';

  if (!email) {
    router.replace('/courses/signup');
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
  );
}

export default function CourseVerifyPage() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[30vh] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </section>
  );
}
