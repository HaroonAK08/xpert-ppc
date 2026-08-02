import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-background pb-12 pt-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card via-background to-background" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: title }]} />
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mb-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
          <p className="text-xs text-muted-foreground">Last updated: {updated}</p>
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="On this page" className="mb-12 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              On this page
            </h2>
            <ol className="space-y-2">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#section-${i + 1}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={s.heading} id={`section-${i + 1}`} className="scroll-mt-28">
                <h2 className="mb-4 text-xl font-extrabold text-foreground">
                  {i + 1}. {s.heading}
                </h2>
                {s.body.map((p) => (
                  <p key={p} className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
