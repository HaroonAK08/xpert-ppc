'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { SOCIAL_LINKS } from '@/lib/socials';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';

type Settings = {
  whatsappUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  announcementTitle: string;
  announcementBody: string;
};

export default function AdminCommunityPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi.get<{ settings: Settings }>('/api/admin/academy/settings').then((res) => {
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSettings({
        ...res.data.settings,
        youtubeUrl: res.data.settings.youtubeUrl || SOCIAL_LINKS.youtube,
        linkedinUrl: res.data.settings.linkedinUrl || SOCIAL_LINKS.linkedin,
      });
    });
  }, []);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    const res = await adminApi.patch<{ settings: Settings }>('/api/admin/academy/settings', {
      whatsappUrl: String(fd.get('whatsappUrl') || ''),
      youtubeUrl: String(fd.get('youtubeUrl') || ''),
      linkedinUrl: String(fd.get('linkedinUrl') || ''),
      instagramUrl: String(fd.get('instagramUrl') || ''),
      announcementTitle: String(fd.get('announcementTitle') || ''),
      announcementBody: String(fd.get('announcementBody') || ''),
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSettings(res.data.settings);
    setSaved(true);
  }

  return (
    <>
      <AdminPageHeader
        title="Community"
        subtitle="WhatsApp group, social links, and dashboard announcement."
      />
      <main className="px-5 py-8 sm:px-8">
        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            Community settings saved. Students will see these on their Community page.
          </p>
        ) : null}

        {!settings ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : (
          <form onSubmit={onSave} className="panel grid max-w-2xl gap-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="whatsappUrl">WhatsApp community link</Label>
              <Input
                id="whatsappUrl"
                name="whatsappUrl"
                defaultValue={settings.whatsappUrl}
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="youtubeUrl">YouTube</Label>
              <Input id="youtubeUrl" name="youtubeUrl" defaultValue={settings.youtubeUrl} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" name="linkedinUrl" defaultValue={settings.linkedinUrl} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={settings.instagramUrl}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="announcementTitle">Announcement title</Label>
              <Input
                id="announcementTitle"
                name="announcementTitle"
                defaultValue={settings.announcementTitle}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="announcementBody">Announcement body</Label>
              <Textarea
                id="announcementBody"
                name="announcementBody"
                defaultValue={settings.announcementBody}
                rows={3}
              />
            </div>
            <Button type="submit" disabled={busy} className="h-11 w-fit">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save community settings'}
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
