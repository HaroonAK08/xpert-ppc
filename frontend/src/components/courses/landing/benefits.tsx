import {
  BookOpenCheck,
  GraduationCap,
  Laptop,
  MessageCircle,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { ApplyCta } from './apply-cta';

const icons = [ShieldCheck, MessageCircle, BookOpenCheck, Rocket, GraduationCap, Laptop];

export function LandingBenefits() {
  const { benefits, offer } = coursesLanding;

  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Everything you need — {offer.strikePrice}{' '}
            <span className="text-primary">just {offer.offerPrice}</span>
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            One application. Three elite tracks. Skills that pay you back.
          </p>
        </Reveal>

        <RevealGroup stagger={0.06} className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem
                key={b.title}
                className="rounded-2xl border border-border bg-card/60 p-6 transition hover:border-primary/40"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="text-center">
          <ApplyCta variant="warm">Get instant access after acceptance</ApplyCta>
        </div>
      </div>
    </section>
  );
}
