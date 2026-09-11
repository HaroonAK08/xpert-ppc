import { CheckCircle2, Star } from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { LoadFade } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingHero() {
  const { hero, stats, offer } = coursesLanding;

  return (
    <section className="relative overflow-hidden border-b border-border bg-background pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(var(--primary),0.22),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_hsla(199,89%,48%,0.12),_transparent_50%)]" />
      <LoadFade y={18} duration={0.5} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-300">
            {hero.eyebrow}
          </p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-sky-300 text-sky-300" />
            <span>Agency-taught · Current cohort</span>
            <span className="mx-1 text-border">|</span>
            <span className="line-through opacity-60">{offer.strikePrice}</span>
            <span className="font-extrabold text-primary">{offer.offerPrice}</span>
          </div>

          <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ApplyCta variant="warm" className="w-full sm:w-auto">
              {hero.primaryCta}
            </ApplyCta>
            <ApplyCta href="/courses/login" variant="outline" className="w-full sm:w-auto">
              {hero.secondaryCta}
            </ApplyCta>
          </div>

          <ul className="mb-12 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-5">
            {hero.trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {t}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="academy-text-gradient text-3xl font-extrabold md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </LoadFade>
    </section>
  );
}
