'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { MapPin, Phone, Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_CITY, usePreviewCity } from './city-preview-context';

function stars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return { full, half };
}

function ResultRow({
  rank,
  name,
  rating,
  reviews,
  category,
  suburb,
  you,
  muted,
}: {
  rank: number;
  name: string;
  rating: number;
  reviews: number;
  category: string;
  suburb: string;
  you?: boolean;
  muted?: boolean;
}) {
  const s = stars(rating);
  return (
    <div
      className={cn(
        'border-b border-zinc-200 px-4 py-3 last:border-b-0',
        you && 'bg-blue-50',
        muted && 'opacity-55'
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            you ? 'bg-[#1a73e8] text-white' : 'bg-zinc-200 text-zinc-600'
          )}
        >
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn('truncate font-semibold', you ? 'text-[#1a73e8]' : 'text-zinc-800')}>
              {name}
            </p>
            {you ? (
              <span className="rounded-full bg-[#1a73e8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Your clinic
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-600">
            <span className="font-semibold text-amber-600">{rating.toFixed(1)}</span>
            <span className="flex text-amber-500">
              {Array.from({ length: s.full }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
              {s.half ? <StarHalf className="h-3 w-3 fill-current" /> : null}
            </span>
            <span>({reviews})</span>
            <span className="text-zinc-400">·</span>
            <span>{category}</span>
            <span className="text-zinc-400">·</span>
            <span>{suburb}</span>
          </div>
          {you ? (
            <div className="mt-2 flex gap-2">
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1a73e8] ring-1 ring-[#1a73e8]/30">
                <Phone className="mr-1 h-3 w-3" /> Call
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1a73e8] ring-1 ring-[#1a73e8]/30">
                <MapPin className="mr-1 h-3 w-3" /> Directions
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SearchPreview() {
  const { city, setCity } = usePreviewCity();
  const [input, setInput] = useState(city);
  const [managed, setManaged] = useState(true);

  const query = useMemo(() => `dermatologist ${city.toLowerCase()}`, [city]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const next = input.trim() || DEFAULT_CITY;
    setCity(next);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="border-b border-primary/15 p-5 sm:p-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
          See what a patient sees
        </p>
        <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
          Type a city and watch the search happen
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Patients type a treatment plus a location. The clinics in the top three get the call.
        </p>
        <form onSubmit={onSearch} className="flex gap-2">
          <label htmlFor="suburb-preview" className="sr-only">
            City or suburb
          </label>
          <input
            id="suburb-preview"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. London, NYC, Sydney"
            className="h-11 flex-1 rounded-xl border border-primary/25 bg-background px-3 text-sm text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </form>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setManaged(false)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors',
              !managed
                ? 'bg-primary text-primary-foreground ring-primary'
                : 'bg-transparent text-muted-foreground ring-primary/30 hover:text-foreground'
            )}
          >
            Unmanaged profile
          </button>
          <button
            type="button"
            onClick={() => setManaged(true)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors',
              managed
                ? 'bg-primary text-primary-foreground ring-primary'
                : 'bg-transparent text-muted-foreground ring-primary/30 hover:text-foreground'
            )}
          >
            Managed by us
          </button>
        </div>
      </div>

      <div className="bg-zinc-100 p-3 sm:p-4">
        <div className="overflow-hidden rounded-2xl bg-white text-zinc-900 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5">
            <span className="text-lg font-medium">
              <span className="text-[#4285f4]">G</span>
              <span className="text-[#ea4335]">o</span>
              <span className="text-[#fbbc05]">o</span>
              <span className="text-[#4285f4]">g</span>
              <span className="text-[#34a853]">l</span>
              <span className="text-[#ea4335]">e</span>
            </span>
            <div className="ml-2 flex-1 truncate rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">
              {query}
            </div>
          </div>

          <div className="relative h-28 overflow-hidden bg-gradient-to-br from-emerald-100 via-sky-100 to-stone-200">
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#64748b_1px,transparent_1px)] [background-size:18px_18px]" />
            <MapPin className="absolute left-[28%] top-8 h-7 w-7 text-[#ea4335] drop-shadow" />
            <MapPin className="absolute left-[52%] top-12 h-7 w-7 text-[#ea4335] drop-shadow" />
            <MapPin
              className={cn(
                'absolute left-[70%] top-6 h-8 w-8 drop-shadow',
                managed ? 'text-[#1a73e8]' : 'text-zinc-400'
              )}
            />
            <p className="absolute bottom-2 left-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
              {city} · Map pack
            </p>
          </div>

          {managed ? (
            <>
              <ResultRow
                rank={1}
                name="Your dermatology clinic"
                rating={4.9}
                reviews={187}
                category="Dermatologist"
                suburb={city}
                you
              />
              <ResultRow
                rank={2}
                name="City Skin & Laser"
                rating={4.6}
                reviews={112}
                category="Skin clinic"
                suburb={city}
              />
              <ResultRow
                rank={3}
                name="Prime Derma Centre"
                rating={4.4}
                reviews={74}
                category="Dermatologist"
                suburb={city}
              />
            </>
          ) : (
            <>
              <ResultRow
                rank={1}
                name="City Skin & Laser"
                rating={4.8}
                reviews={203}
                category="Skin clinic"
                suburb={city}
              />
              <ResultRow
                rank={2}
                name="Prime Derma Centre"
                rating={4.7}
                reviews={156}
                category="Dermatologist"
                suburb={city}
              />
              <ResultRow
                rank={3}
                name="Your dermatology clinic"
                rating={4.1}
                reviews={18}
                category="Dermatologist"
                suburb={city}
                muted
              />
            </>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Illustration of a local Google result — not live data. We build this position with ads,
          SEO, your Google profile, and the clinic website.
        </p>
      </div>
    </div>
  );
}
