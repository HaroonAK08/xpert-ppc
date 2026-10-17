import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCourses } from '@/lib/courses';
import { SignupForm } from './signup-form';

export const metadata: Metadata = { title: 'Create your account' };

export default async function SignupPage() {
  const courses = await getCourses();
  return (
    <Suspense>
      <SignupForm courses={courses} />
    </Suspense>
  );
}
