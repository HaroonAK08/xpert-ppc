import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';

export function LandingTestimonials() {
  const items = coursesLanding.testimonials;

  return (
    <section id="success-stories" className="scroll-mt-28 border-b border-border bg-card/40 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-300">Real students</p>
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Don&apos;t just take our word — hear it from learners
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            People who started where you are now — scrolling this same page.
          </p>
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <RevealItem
              key={t.name}
              className="rounded-2xl border border-border bg-background/80 p-5 shadow-sm"
            >
              <p className="mb-4 text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
