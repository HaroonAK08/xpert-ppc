import { coursesLanding } from '@shared/content/courses-landing';
import { Reveal } from '@/components/motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ApplyCta } from './apply-cta';
import { SectionEyebrow, SectionHeading } from './section';

export function LandingFaq() {
  return (
    <section id="faq" className="scroll-mt-28 border-b border-slate-200/80 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <SectionHeading
            title="Before you book the call"
            subtitle="Straight answers about interviews, skills, and pricing."
          />
        </Reveal>

        <Reveal className="mx-auto mb-12 max-w-2xl rounded-2xl border border-slate-200 bg-white px-4 sm:px-6">
          <Accordion type="single" collapsible className="w-full">
            {coursesLanding.faq.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-slate-200">
                <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:text-[#1d6ff2] hover:no-underline sm:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-600">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <div className="text-center">
          <ApplyCta variant="warm">Book a discovery meeting</ApplyCta>
        </div>
      </div>
    </section>
  );
}
