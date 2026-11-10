export type AnnouncementMessage = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
};

export type AnnouncementList = { items: AnnouncementMessage[]; total: number; page: number; pageSize: number };

export function announcementDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
