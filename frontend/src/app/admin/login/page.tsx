import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8">
          <h1 className="mb-2 text-2xl font-extrabold text-foreground">Admin Login</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Sign in to review leads submitted through the site.
          </p>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
