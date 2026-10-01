import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

/** Named company/field buckets that group client users and their shared leads. */
const ClientFieldSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
  },
  { timestamps: true }
);

ClientFieldSchema.index({ name: 1 }, { unique: true });

export type ClientFieldDoc = InferSchemaType<typeof ClientFieldSchema>;

export const ClientField: Model<ClientFieldDoc> =
  (mongoose.models.ClientField as Model<ClientFieldDoc>) ||
  mongoose.model<ClientFieldDoc>('ClientField', ClientFieldSchema);

export default ClientField;
