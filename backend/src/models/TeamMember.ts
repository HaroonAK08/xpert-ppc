import mongoose, { Schema, type Model, type InferSchemaType } from 'mongoose';

const TeamMemberSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    longBio: { type: String, default: '' },
    photo: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    yearsExperience: { type: Number, default: 0 },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },

    expertise: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    highlights: {
      type: [{ label: { type: String, required: true }, value: { type: String, required: true } }],
      default: [],
    },
    socials: {
      linkedin: { type: String, default: '' },
      upwork: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },

    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema>;

export const TeamMember: Model<TeamMemberDoc> =
  (mongoose.models.TeamMember as Model<TeamMemberDoc>) ||
  mongoose.model<TeamMemberDoc>('TeamMember', TeamMemberSchema);

export default TeamMember;
