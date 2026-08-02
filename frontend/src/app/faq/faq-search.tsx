'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, MessageSquare, Search } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/motion';
import { Input } from '@/components/ui/input';
import type { FaqItem } from '@shared/content/faqs';

export function FaqSearch({ faqs }: { faqs: FaqItem[] }) {
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, FaqItem[]>();

    for (const f of faqs) {
      if (q && !f.question.toLowerCase().includes(q) && !f.answer.toLowerCase().includes(q)) {
        continue;
      }
      const list = map.get(f.category) ?? [];
      list.push(f);
      map.set(f.category, list);
    }

    return [...map.entries()];
  }, [faqs, query]);

  return (
    <>
      {/* Search shares the same container left edge as the hero + FAQ list */}
      <section className="sticky top-20 z-40 border-b border-primary/10 bg-background/95 py-4 backdrop-blur-md sm:py-6 md:py-8">
        <div className="container mx-auto px-4 text-left sm:px-6 lg:px-8">
          <div className="relative max-w-4xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions (e.g. Budget, ACOS)..."
              aria-label="Search frequently asked questions"
              className="h-12 w-full rounded-xl border-primary/30 bg-card pl-12 text-base text-foreground shadow-lg focus-visible:ring-accent sm:h-14 sm:text-lg"
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4 text-left sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {grouped.length === 0 ? (
              <div className="rounded-2xl border border-primary/10 bg-card py-20 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mb-2 text-xl font-bold text-foreground">No results found</h3>
                <p className="text-muted-foreground">
                  We couldn&apos;t find any FAQs matching &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mt-6 font-medium text-primary transition-colors hover:text-accent"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                {grouped.map(([category, items], categoryIndex) => (
                  <Reveal
                    key={category}
                    y={20}
                    duration={0.4}
                    delay={categoryIndex * 0.1}
                    margin="-50px"
                    amount={0.15}
                    className="mb-12"
                  >
                    <h2 className="mb-6 flex items-center text-2xl font-bold text-primary">
                      <MessageSquare className="mr-3 h-6 w-6 text-accent" />
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {items.map((f) => (
                        <AccordionItem
                          key={f.question}
                          value={f.question}
                          className="rounded-xl border border-primary/20 bg-background transition-colors duration-300 hover:bg-card/50 data-[state=open]:border-primary/50 data-[state=open]:bg-card"
                        >
                          <AccordionTrigger className="px-4 py-4 text-base font-semibold hover:no-underline sm:px-6 sm:py-5 sm:text-lg [&>svg]:hidden [&[data-state=open]_.faq-chevron]:rotate-180">
                            <span className="min-w-0 flex-1 pr-4 text-left text-balance sm:pr-8">
                              {f.question}
                            </span>
                            <span className="faq-chevron flex shrink-0 rounded-full bg-primary/10 p-1 transition-transform duration-300">
                              <ChevronDown className="h-5 w-5 text-primary" />
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-5 pt-0 text-base leading-relaxed text-muted-foreground sm:px-6">
                            {f.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
