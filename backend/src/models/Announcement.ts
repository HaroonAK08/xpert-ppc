import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const AnnouncementSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  body: { type: String, required: true, trim: true, maxlength: 4000 },
  published: { type: Boolean, default: true },
}, { timestamps: true });
AnnouncementSchema.index({ published: 1, createdAt: -1, _id: -1 });

export const Announcement = mongoose.models.Announcement as mongoose.Model<InferSchemaType<typeof AnnouncementSchema>> ||
  mongoose.model('Announcement', AnnouncementSchema);

export function serializeAnnouncement(item: InferSchemaType<typeof AnnouncementSchema> & { _id: unknown }) {
  return { id: String(item._id), title: item.title, body: item.body, published: item.published, createdAt: item.createdAt };
}
