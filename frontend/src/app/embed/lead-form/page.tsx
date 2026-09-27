import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LeadForm } from '@/components/forms/lead-form';
import { DynamicLeadForm } from '@/components/forms/dynamic-lead-form';
import { EmbedResize } from './embed-resize';

export const metadata: Metadata = {
  title: 'Contact form',
  robots: { index: false, follow: false, nocache: true },
};

export default async function EmbedLeadFormPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>;
}) {
  const { form } = await searchParams;

  return (
    <div className="bg-transparent p-1">
      <EmbedResize />
      <Suspense fallback={null}>
        {form ? <DynamicLeadForm formId={form} /> : <LeadForm source="embed" compact submitLabel="Send" />}
      </Suspense>
    </div>
  );
}
