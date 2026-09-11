import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b border-border bg-card/30 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-300">Your journey</p>
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            From this page to your first lesson
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Most students move from apply to portal access as soon as they are accepted.
          </p>
        </Reveal>

        <RevealGroup stagger={0.1} className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.howItWorks.map((s) => (
            <RevealItem
              key={s.step}
              className="relative rounded-2xl border border-border bg-background p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-primary text-sm font-black text-white">
                  {s.step}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {s.time}
                </span>
              </div>
              <h3 className="mb-2 text-base font-extrabold text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Start step 1 — apply now</ApplyCta>
        </div>
      </div>
    </section>
  );
}
