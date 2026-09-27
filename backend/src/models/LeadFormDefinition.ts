import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const FormFieldSchema = new Schema(
  {
    // A STANDARD_FORM_FIELDS key (shared/crm/constants.ts) or a CustomFieldDefinition.key.
    key: { type: String, required: true, trim: true },
    standard: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    // Per-form overrides — fall back to the catalog/custom-property defaults when empty.
    label: { type: String, default: '', trim: true, maxlength: 80 },
    placeholder: { type: String, default: '', trim: true, maxlength: 120 },
  },
  { _id: false }
);

const LeadFormDefinitionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 200 },
    badgeText: { type: String, default: 'Contact', trim: true, maxlength: 30 },
    fields: { type: [FormFieldSchema], default: [] },
    submitLabel: { type: String, default: 'Send', trim: true, maxlength: 40 },
    buttonColor: { type: String, default: '#2563eb', trim: true, maxlength: 20 },
    backgroundColor: { type: String, default: '#ffffff', trim: true, maxlength: 20 },
    textColor: { type: String, default: '#0f172a', trim: true, maxlength: 20 },
    cornerRadius: { type: Number, default: 8, min: 0, max: 24 },
    spacing: { type: Number, default: 16, min: 8, max: 32 },
    fontSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' },
    // After submit: show a thank-you message, optionally redirect to a path/URL.
    successMessage: {
      type: String,
      default: "Thank you — we've got it.",
      trim: true,
      maxlength: 240,
    },
    successRedirectUrl: { type: String, default: '', trim: true, maxlength: 500 },
    // Internal CRM labels only — not shown on the public embed (e.g. Website, Facebook).
    tags: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

export type LeadFormDefinitionDoc = InferSchemaType<typeof LeadFormDefinitionSchema>;

export const LeadFormDefinition: Model<LeadFormDefinitionDoc> =
  (mongoose.models.LeadFormDefinition as Model<LeadFormDefinitionDoc>) ||
  mongoose.model<LeadFormDefinitionDoc>('LeadFormDefinition', LeadFormDefinitionSchema);

export default LeadFormDefinition;
