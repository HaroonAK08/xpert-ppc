import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';

export function LandingProof() {
  return (
    <section className="border-b border-border bg-card/40 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Proof</p>
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            We teach from work we&apos;ve actually done
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Everything in these courses comes from live campaigns and real client results.
          </p>
        </Reveal>

        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coursesLanding.proof.map((p) => (
            <RevealItem
              key={p.title}
              className="rounded-2xl border border-border bg-background p-6 text-center"
            >
              <p className="mb-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-3xl font-black text-transparent">
                {p.value}
              </p>
              <h3 className="mb-2 text-base font-bold text-foreground">{p.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{p.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
