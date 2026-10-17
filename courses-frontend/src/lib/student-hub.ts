import { api } from './api';

export type HubSession = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  startsAt: string;
  endsAt?: string | null;
  meetLink: string;
  timezone: string;
  notes: string;
};

export type HubRecording = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  recordedAt?: string | null;
};

export type HubResource = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  kind: string;
  description: string;
  fileUrl: string;
};

export type HubCommunity = {
  whatsappUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  announcementTitle: string;
  announcementBody: string;
};

export type StudentHub = {
  nextSession: HubSession | null;
  sessions: HubSession[];
  recordings: HubRecording[];
  resources: HubResource[];
  community: HubCommunity;
};

export async function fetchStudentHub() {
  return api.get<StudentHub>('/api/student/hub/home');
}
