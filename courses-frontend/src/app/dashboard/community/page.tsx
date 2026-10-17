'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Instagram, Linkedin, MessageCircle, Users, Youtube } from 'lucide-react';
import { fetchStudentHub, type HubCommunity } from '@/lib/student-hub';
import { SOCIAL_LINKS } from '@/lib/socials';
import { DashboardPageHeader } from '@/components/dashboard/page-header';

export default function CommunityPage() {
  const [community, setCommunity] = useState<HubCommunity | null>(null);

  useEffect(() => {
    fetchStudentHub().then((res) => {
      if (!res.ok) {
        setCommunity({
          whatsappUrl: '',
          youtubeUrl: SOCIAL_LINKS.youtube,
          linkedinUrl: SOCIAL_LINKS.linkedin,
          instagramUrl: '',
          announcementTitle: 'Welcome to the academy',
          announcementBody: 'Check this dashboard for your batch schedule and learning resources.',
        });
        return;
      }
      setCommunity({
        ...res.data.community,
        youtubeUrl: res.data.community.youtubeUrl || SOCIAL_LINKS.youtube,
        linkedinUrl: res.data.community.linkedinUrl || SOCIAL_LINKS.linkedin,
      });
    });
  }, []);

  const channels = community
    ? [
        {
          title: 'WhatsApp Community',
          description: 'Batch announcements, peer support, and quick questions with classmates.',
          color: 'bg-[#25D366]/15 text-[#25D366]',
          icon: 'whatsapp' as const,
          cta: 'View Community',
          href: community.whatsappUrl || null,
          note: community.whatsappUrl ? 'Join the batch group' : 'Community link coming soon.',
        },
        {
          title: 'YouTube',
          description: 'Public lessons, tips, and academy updates from XpertPPC.',
          color: 'bg-[#FF0000]/10 text-[#FF0000]',
          icon: Youtube,
          cta: 'Open YouTube',
          href: community.youtubeUrl || null,
          note: 'Xpert PPC with Umer Khan',
        },
        {
          title: 'LinkedIn',
          description: 'Follow the academy and connect with instructors and alumni.',
          color: 'bg-[#0A66C2]/10 text-[#0A66C2]',
          icon: Linkedin,
          cta: 'Open LinkedIn',
          href: community.linkedinUrl || null,
          note: 'Xpert PPC company page',
        },
        {
          title: 'Instagram',
          description: 'Short tips, student wins, and behind-the-scenes from class.',
          color: 'bg-[#DD2A7B]/10 text-[#DD2A7B]',
          icon: Instagram,
          cta: 'Open Instagram',
          href: community.instagramUrl || null,
          note: community.instagramUrl ? 'Follow on Instagram' : 'Link coming soon.',
        },
      ]
    : [];

  return (
    <>
      <DashboardPageHeader title="Community" />
      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Stay connected</h2>
        <p className="mt-1 text-sm text-muted">Join the student community and follow XpertPPC online.</p>

        {!community ? (
          <p className="mt-6 text-sm text-muted">Loading…</p>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {channels.map((channel) => {
                const Icon = channel.icon === 'whatsapp' ? MessageCircle : channel.icon;
                const ctaClass =
                  'mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand text-xs font-bold text-white';
                return (
                  <div key={channel.title} className="panel flex flex-col p-6">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${channel.color}`}>
                      {channel.icon === 'whatsapp' ? (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </span>
                    <p className="mt-4 text-base font-extrabold text-ink">{channel.title}</p>
                    <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{channel.description}</p>
                    {channel.href ? (
                      <a href={channel.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
                        {channel.cta}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <button type="button" disabled className={`${ctaClass} opacity-80`}>
                        {channel.cta}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <p className="mt-2 text-center text-[11px] text-muted">{channel.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 panel flex items-start gap-3 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Users className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">
                  {community.announcementTitle || 'Batch updates'}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {community.announcementBody ||
                    'Once your enrollment is confirmed, your instructor will share community links here.'}
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
