import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const AcademySettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    whatsappUrl: { type: String, default: '', trim: true },
    youtubeUrl: { type: String, default: '', trim: true },
    linkedinUrl: { type: String, default: '', trim: true },
    instagramUrl: { type: String, default: '', trim: true },
    announcementTitle: { type: String, default: 'Welcome to the academy', trim: true },
    announcementBody: {
      type: String,
      default: 'Check this dashboard for your batch schedule and learning resources.',
      trim: true,
    },
  },
  { timestamps: true }
);

export type AcademySettingsDoc = InferSchemaType<typeof AcademySettingsSchema>;

export const AcademySettings: Model<AcademySettingsDoc> =
  (mongoose.models.AcademySettings as Model<AcademySettingsDoc>) ||
  mongoose.model<AcademySettingsDoc>('AcademySettings', AcademySettingsSchema);

export async function getAcademySettings() {
  let doc = await AcademySettings.findOne({ key: 'default' });
  if (!doc) {
    doc = await AcademySettings.create({ key: 'default' });
  }
  return doc;
}

export default AcademySettings;
