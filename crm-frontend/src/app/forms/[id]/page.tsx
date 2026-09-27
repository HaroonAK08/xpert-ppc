'use client';

import { use as usePromise } from 'react';

import { FormBuilderStudio } from '../form-builder-studio';

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  return <FormBuilderStudio mode="edit" formId={id} />;
}
