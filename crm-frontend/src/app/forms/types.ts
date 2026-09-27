import { STANDARD_FORM_FIELDS } from '@shared/crm/constants';

export type FieldSelection = {
  key: string;
  standard: boolean;
  required: boolean;
  label: string;
  placeholder: string;
};

export type LeadForm = {
  id: string;
  name: string;
  description: string;
  badgeText: string;
  fields: FieldSelection[];
  submitLabel: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  cornerRadius: number;
  spacing: number;
  fontSize: 'sm' | 'md' | 'lg';
  successMessage: string;
  successRedirectUrl: string;
  tags: string[];
  enabled: boolean;
  createdAt: string;
};

export type CustomFieldDefinition = {
  id: string;
  key: string;
  label: string;
  type: string;
  options?: string[];
};

export type BuilderField = {
  key: string;
  standard: boolean;
  locked: boolean;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
};

export type BuilderState = {
  name: string;
  description: string;
  badgeText: string;
  submitLabel: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  cornerRadius: number;
  spacing: number;
  fontSize: 'sm' | 'md' | 'lg';
  successMessage: string;
  successRedirectUrl: string;
  tags: string[];
  fields: BuilderField[];
};

export const MARKETING_SITE_URL = (
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export function snippetFor(formId: string) {
  return `<script src="${MARKETING_SITE_URL}/embed.js" data-form="${formId}" async></script>`;
}

export const FORM_TAG_PRESETS = [
  'Website',
  'Facebook',
  'Instagram',
  'Landing page',
  'Google Ads',
  'Meta Ads',
  'LinkedIn',
  'Partner',
] as const;

export const DEFAULT_BUILDER_STATE: BuilderState = {
  name: '',
  description: '',
  badgeText: 'Contact',
  submitLabel: 'Send message',
  buttonColor: '#1d6ff2',
  backgroundColor: '#ffffff',
  textColor: '#0b1f4d',
  cornerRadius: 10,
  spacing: 16,
  fontSize: 'md',
  successMessage: "Thank you — we've got it. We'll be in touch shortly.",
  successRedirectUrl: '',
  tags: [],
  fields: [
    {
      key: 'name',
      standard: true,
      locked: true,
      label: 'Full name',
      placeholder: 'e.g. Jane Doe',
      type: 'text',
      required: true,
    },
    {
      key: 'email',
      standard: true,
      locked: true,
      label: 'Email',
      placeholder: 'you@email.com',
      type: 'email',
      required: true,
    },
  ],
};

export function leadFormToBuilder(form: LeadForm, customFields: CustomFieldDefinition[]): BuilderState {
  return {
    name: form.name,
    description: form.description,
    badgeText: form.badgeText,
    submitLabel: form.submitLabel,
    buttonColor: form.buttonColor,
    backgroundColor: form.backgroundColor,
    textColor: form.textColor,
    cornerRadius: form.cornerRadius,
    spacing: form.spacing,
    fontSize: form.fontSize,
    successMessage: form.successMessage || DEFAULT_BUILDER_STATE.successMessage,
    successRedirectUrl: form.successRedirectUrl || '',
    tags: form.tags || [],
    fields: form.fields.map((f) => {
      if (f.standard) {
        const std = STANDARD_FORM_FIELDS.find((s) => s.key === f.key);
        return {
          key: f.key,
          standard: true,
          locked: f.key === 'name' || f.key === 'email',
          label: f.label || std?.label || f.key,
          placeholder: f.placeholder,
          type: std?.type || 'text',
          required: f.required,
        };
      }
      const custom = customFields.find((c) => c.key === f.key);
      return {
        key: f.key,
        standard: false,
        locked: false,
        label: f.label || custom?.label || f.key,
        placeholder: f.placeholder,
        type: custom?.type || 'text',
        required: f.required,
      };
    }),
  };
}
