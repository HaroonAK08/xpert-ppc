"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ArrowRight, Clock3, Search } from "lucide-react";

import burgerImage from "../../../../public/lp/restaurant/lp-restaurant-burger.png";
import familyImage from "../../../../public/lp/restaurant/lp-restaurant-family.png";
import deliveryImage from "../../../../public/lp/restaurant/lp-restaurant-delivery.png";

type Window = {
  slot: string;
  label: string;
  fill: string;
  query: string;
  caption: string;
  image: StaticImageData;
};

const windows: Window[] = [
  {
    slot: "12–2 PM",
    label: "Lunch rush",
    fill: "72%",
    query: "best lunch near me",
    caption: "Capture office lunches and weekday diners while intent is hot.",
    image: burgerImage,
  },
  {
    slot: "4–6 PM",
    label: "Snack window",
    fill: "38%",
    query: "coffee and dessert near me",
    caption:
      "Turn the quiet window into an offer people can discover and share.",
    image: familyImage,
  },
  {
    slot: "7–10 PM",
    label: "Dinner peak",
    fill: "94%",
    query: "family restaurant tonight",
    caption: "Put your tables in front of diners deciding where to go tonight.",
    image: familyImage,
  },
  {
    slot: "Late night",
    label: "Delivery surge",
    fill: "61%",
    query: "late night delivery near me",
    caption: "Make direct ordering the easy next step after the craving hits.",
    image: deliveryImage,
  },
];

export function ServiceClock() {
  const [active, setActive] = useState(2);
  const current = windows[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F5A524]">
          <Clock3 className="h-4 w-4" />
          The service clock
        </div>
        <h2 className="mb-4 font-[var(--font-resto-display)] text-4xl tracking-wide text-white sm:text-5xl">
          Be visible when the craving starts.
        </h2>
        <p className="mb-7 max-w-lg text-sm leading-relaxed text-neutral-300 sm:text-base">
          Your campaigns should change with the day. Choose a service window to
          see how we turn a real restaurant moment into a measurable search,
          offer, and order opportunity.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {windows.map((item, index) => (
            <button
              key={item.slot}
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`rounded-2xl border p-4 text-left transition-colors motion-reduce:transition-none ${
                active === index
                  ? "border-[#F5A524] bg-[#F5A524] text-[#0E0E0E]"
                  : "border-white/15 bg-white/5 text-white hover:border-[#F5A524]/70"
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-wider opacity-70">
                {item.slot}
              </span>
              <span className="mt-1 block text-sm font-bold">{item.label}</span>
              <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-black/20">
                <span
                  className="block h-full rounded-full bg-current"
                  style={{ width: item.fill }}
                />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Illustrative demand windows, not live search data.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#161616] shadow-2xl">
        <div className="relative h-64 sm:h-80">
          <Image
            src={current.image}
            alt={`${current.label} restaurant campaign example`}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition-opacity duration-300 motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 sm:left-7 sm:right-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#0E0E0E] shadow-lg">
              <Search className="h-3.5 w-3.5" />
              {current.query}
            </div>
            <p className="max-w-md text-sm font-medium leading-relaxed text-white sm:text-base">
              {current.caption}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:px-7">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#F5A524]">
            {current.label}
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-white">
            Track every enquiry <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
