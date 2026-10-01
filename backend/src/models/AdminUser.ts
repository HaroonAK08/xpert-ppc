import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    // scrypt hash — see src/utils/password.ts
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'editor', 'client'], default: 'admin' },
    /** Company/field this client user belongs to — leads are shared within the field. */
    fieldId: { type: Schema.Types.ObjectId, ref: 'ClientField', default: null, index: true },
    lastLoginAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>;

export const AdminUser: Model<AdminUserDoc> =
  (mongoose.models.AdminUser as Model<AdminUserDoc>) ||
  mongoose.model<AdminUserDoc>('AdminUser', AdminUserSchema);

export default AdminUser;
