import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ApplyCta } from './apply-cta';

export function LandingFaq() {
  return (
    <section id="faq" className="scroll-mt-28 border-b border-border bg-card/30 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="mb-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Got questions? We&apos;ve got answers
          </h2>
        </Reveal>

        <Reveal className="mx-auto mb-10 max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {coursesLanding.faq.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-bold sm:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <div className="text-center">
          <ApplyCta variant="warm">Join the academy today</ApplyCta>
        </div>
      </div>
    </section>
  );
}
