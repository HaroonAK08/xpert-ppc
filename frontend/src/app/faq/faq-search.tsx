'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/motion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@shared/content/faqs';

const ALL = 'All';

export function FaqSearch({ faqs }: { faqs: FaqItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);

  /** Category tabs, with a count so the filter is worth using. */
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of faqs) counts.set(f.category, (counts.get(f.category) ?? 0) + 1);
    return [{ name: ALL, count: faqs.length }, ...[...counts].map(([name, count]) => ({ name, count }))];
  }, [faqs]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, FaqItem[]>();

    for (const f of faqs) {
      if (category !== ALL && f.category !== category) continue;
      if (q && !f.question.toLowerCase().includes(q) && !f.answer.toLowerCase().includes(q)) {
        continue;
      }
      const list = map.get(f.category) ?? [];
      list.push(f);
      map.set(f.category, list);
    }

    return [...map.entries()];
  }, [faqs, query, category]);

  const resultCount = grouped.reduce((n, [, items]) => n + items.length, 0);
  const filtered = query.trim().length > 0 || category !== ALL;

  return (
    <>
      {/* Search + category filter */}
      <section className="sticky top-20 z-40 border-y border-white/[0.07] bg-[#060c1d]/95 py-5 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6d7f9e]" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions — try “budget”, “ACOS”, “tracking”"
              aria-label="Search frequently asked questions"
              className="h-12 w-full rounded-xl border-white/[0.09] bg-[#0e1a38] pl-11 text-[0.95rem] text-white placeholder:text-[#6d7f9e] focus-visible:ring-primary"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8e9fbc] transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <ul className="mt-4 flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => setCategory(c.name)}
                  aria-pressed={category === c.name}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors',
                    category === c.name
                      ? 'border-primary/45 bg-primary/15 text-primary'
                      : 'border-white/[0.08] bg-white/[0.035] text-[#9fb0cc] hover:border-primary/30 hover:text-white'
                  )}
                >
                  {c.name}
                  <span className="text-[11px] opacity-70">{c.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered ? (
            <p className="mb-8 text-[13px] text-[#8e9fbc]">
              {resultCount} {resultCount === 1 ? 'question' : 'questions'}
              {category !== ALL ? ` in ${category}` : ''}
              {query.trim() ? ` matching “${query.trim()}”` : ''}
            </p>
          ) : null}

          {grouped.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/[0.08] bg-[#0e1a38] px-6 py-14 text-center">
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </span>
              <h2 className="mb-2 text-lg font-bold text-white">No matching questions</h2>
              <p className="text-sm leading-relaxed text-[#9fb0cc]">
                Nothing here answers &ldquo;{query}&rdquo;. Clear the filters, or send the question
                over and you&apos;ll get a straight answer.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory(ALL);
                }}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.14] px-5 text-sm font-bold text-white transition-colors hover:border-primary/50 hover:bg-white/[0.06] hover:text-primary"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-12 md:space-y-16">
              {grouped.map(([group, items], groupIndex) => (
                <Reveal
                  key={group}
                  y={16}
                  duration={0.45}
                  delay={groupIndex * 0.06}
                  amount={0.1}
                >
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4">
                      <h2 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
                        {group}
                      </h2>
                      <p className="mt-2 text-[13px] text-[#6d7f9e]">
                        {items.length} {items.length === 1 ? 'question' : 'questions'}
                      </p>
                    </div>

                    <div className="lg:col-span-8">
                      <Accordion type="single" collapsible className="space-y-3">
                        {items.map((f) => (
                          <AccordionItem
                            key={f.question}
                            value={f.question}
                            className="rounded-xl border border-white/[0.08] bg-[#0e1a38] px-1 data-[state=open]:border-primary/40 data-[state=open]:bg-[#122047]"
                          >
                            <AccordionTrigger className="text-left text-[0.95rem] font-semibold text-white hover:text-primary hover:no-underline">
                              <span className="min-w-0 flex-1 text-balance">{f.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="leading-relaxed text-[#9fb0cc]">
                              {f.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
