import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const ContactSchema = new Schema(
  {
    // A cookie-generated id the tracking script assigns on first visit — the
    // one durable key that lets us stitch anonymous page views to a person.
    anonymousId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '', index: true },
    phone: { type: String, trim: true, default: '' },
    // Which team member's site this visitor belongs to, same pattern as Lead.ownerUserId.
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null, index: true },
    firstSeenAt: { type: Date, default: () => new Date() },
    lastSeenAt: { type: Date, default: () => new Date(), index: true },
    // Set once this visitor submits a form and becomes a real Lead.
    convertedLeadId: { type: Schema.Types.ObjectId, ref: 'Lead', default: null, index: true },
  },
  { timestamps: true }
);

export type ContactDoc = InferSchemaType<typeof ContactSchema>;

export const Contact: Model<ContactDoc> =
  (mongoose.models.Contact as Model<ContactDoc>) || mongoose.model<ContactDoc>('Contact', ContactSchema);

export default Contact;
