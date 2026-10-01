import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const ConditionSchema = new Schema(
  {
    field: { type: String, enum: ['source', 'platform', 'sourcePath'], required: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ActionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['set_status', 'assign_to', 'add_note', 'enroll_in_sequence', 'send_email'],
      required: true,
    },
    status: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    text: { type: String, default: '' },
    sequenceId: { type: Schema.Types.ObjectId, ref: 'EmailSequence', default: null },
    subject: { type: String, default: '' },
    body: { type: String, default: '' },
  },
  { _id: false }
);

const AutomationRuleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    trigger: { type: String, enum: ['lead_created', 'status_changed'], required: true },
    // status_changed only — empty string means "any" for either side.
    fromStatus: { type: String, default: '' },
    toStatus: { type: String, default: '' },
    conditions: { type: [ConditionSchema], default: [] },
    actions: { type: [ActionSchema], default: [] },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    /** null = main admin pool; set for company/field team rules. */
    fieldId: { type: Schema.Types.ObjectId, ref: 'ClientField', default: null, index: true },
  },
  { timestamps: true }
);

AutomationRuleSchema.index({ trigger: 1, enabled: 1, order: 1 });
AutomationRuleSchema.index({ fieldId: 1, trigger: 1, enabled: 1, order: 1 });

export type AutomationRuleDoc = InferSchemaType<typeof AutomationRuleSchema>;

export const AutomationRule: Model<AutomationRuleDoc> =
  (mongoose.models.AutomationRule as Model<AutomationRuleDoc>) ||
  mongoose.model<AutomationRuleDoc>('AutomationRule', AutomationRuleSchema);

export default AutomationRule;
