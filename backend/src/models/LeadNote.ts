import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const LeadNoteSchema = new Schema(
  {
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    // Optional: notes added by the automation engine have no human author.
    author: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
    authorName: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { timestamps: true }
);

LeadNoteSchema.index({ lead: 1, createdAt: -1 });

export type LeadNoteDoc = InferSchemaType<typeof LeadNoteSchema>;

export const LeadNote: Model<LeadNoteDoc> =
  (mongoose.models.LeadNote as Model<LeadNoteDoc>) ||
  mongoose.model<LeadNoteDoc>('LeadNote', LeadNoteSchema);

export default LeadNote;
