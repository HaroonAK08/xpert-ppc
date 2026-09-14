import { Quote } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { AcademyPanel, SectionEyebrow, SectionHeading } from './section';

const avatarTone = [
  'from-sky-100 to-blue-100 text-[#1558c7]',
  'from-emerald-100 to-teal-100 text-emerald-700',
  'from-amber-100 to-orange-100 text-amber-800',
  'from-violet-100 to-indigo-100 text-indigo-700',
];

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function LandingTestimonials() {
  return (
    <section id="success-stories" className="scroll-mt-28 border-b border-slate-200/80 bg-slate-50/70 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <SectionHeading
            title="What early learners say"
            subtitle="People who started with a discovery call — then a path that fit. Real stories coming soon."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.testimonials.map((t, i) => (
            <RevealItem key={t.name}>
              <AcademyPanel className="relative flex h-full flex-col p-5 sm:p-6">
                <Quote className="mb-3 h-5 w-5 text-[#1d6ff2]/50" aria-hidden />
                <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold ${avatarTone[i % avatarTone.length]}`}
                  >
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </AcademyPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
