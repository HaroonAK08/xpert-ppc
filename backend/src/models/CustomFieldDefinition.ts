import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const CustomFieldDefinitionSchema = new Schema(
  {
    // Slug used as the key inside Lead.customFields, e.g. "industry".
    key: { type: String, required: true, trim: true, lowercase: true, unique: true },
    label: { type: String, required: true, trim: true, maxlength: 80 },
    type: { type: String, enum: ['text', 'number', 'date', 'select'], required: true },
    // Only meaningful when type === 'select'.
    options: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  },
  { timestamps: true }
);

export type CustomFieldDefinitionDoc = InferSchemaType<typeof CustomFieldDefinitionSchema>;

export const CustomFieldDefinition: Model<CustomFieldDefinitionDoc> =
  (mongoose.models.CustomFieldDefinition as Model<CustomFieldDefinitionDoc>) ||
  mongoose.model<CustomFieldDefinitionDoc>('CustomFieldDefinition', CustomFieldDefinitionSchema);

export default CustomFieldDefinition;
