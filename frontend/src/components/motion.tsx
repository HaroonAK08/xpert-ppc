'use client';

import { MotionConfig, motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Wraps the app so every animation honours the OS "reduce motion" setting.
 * CSS alone can't do this — framer-motion animates via JS transforms.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Motion primitives matching the production site's entrance animations.
 *
 * Two families:
 *  - `Reveal` / `RevealGroup` fire once when scrolled into view.
 *  - `LoadGroup` fires immediately on mount (used by the hero).
 *
 * Animations are declared here rather than inline so pages can stay server
 * components — only these wrappers ship to the client.
 */

type Ease = 'easeOut';
const EASE: Ease = 'easeOut';

/* ------------------------------------------------------------------ */
/* Scroll reveal — single element                                      */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Vertical offset to travel from. Ignored when `x` or `scale` is set. */
  y?: number;
  /** Horizontal slide (about/contact columns use ±20–30). */
  x?: number;
  /** Scale-in instead of slide (used by the closing CTA card). */
  scale?: number;
  duration?: number;
  /** Fraction of the element that must be visible before firing. */
  amount?: number;
  delay?: number;
  margin?: string;
  as?: 'div' | 'section' | 'h2' | 'p' | 'ul' | 'li' | 'article' | 'aside' | 'figure';
};

export function Reveal({
  children,
  className,
  y = 16,
  x = 0,
  scale,
  duration = 0.6,
  amount = 0.4,
  delay,
  margin,
  as = 'div',
}: RevealProps) {
  const Cmp = motion[as];

  const initial = scale
    ? { opacity: 0, scale }
    : x
      ? { opacity: 0, x }
      : { opacity: 0, y };
  const visible = scale
    ? { opacity: 1, scale: 1 }
    : x
      ? { opacity: 1, x: 0 }
      : { opacity: 1, y: 0 };

  return (
    <Cmp
      className={className}
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, amount, ...(margin ? { margin } : {}) }}
      transition={{ duration, ease: EASE, ...(delay ? { delay } : {}) }}
    >
      {children}
    </Cmp>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll reveal — staggered children                                  */
/* ------------------------------------------------------------------ */

export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  amount = 0.15,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
  as?: 'div' | 'ul' | 'ol' | 'dl';
}) {
  const Cmp = motion[as];

  return (
    <Cmp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Cmp>
  );
}

const itemVariants = (y: number, x: number): Variants => ({
  hidden: { opacity: 0, ...(x ? { x } : { y }) },
  visible: { opacity: 1, ...(x ? { x: 0 } : { y: 0 }) },
});

export function RevealItem({
  children,
  className,
  y = 20,
  x = 0,
  duration = 0.55,
  delay,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  /** Slide in horizontally instead (the process steps use x: -24). */
  x?: number;
  duration?: number;
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'figure';
}) {
  const Cmp = motion[as];

  return (
    <Cmp
      className={className}
      variants={itemVariants(y, x)}
      transition={{ duration, ease: EASE, ...(delay ? { delay } : {}) }}
    >
      {children}
    </Cmp>
  );
}

/* ------------------------------------------------------------------ */
/* On-load stagger — the hero                                          */
/* ------------------------------------------------------------------ */

export function LoadGroup({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0.05,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function LoadItem({
  children,
  className,
  y = 12,
  duration = 0.6,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  as?: 'div' | 'h1' | 'p' | 'ul';
}) {
  const Cmp = motion[as];

  return (
    <Cmp
      className={className}
      variants={{ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration, ease: EASE }}
    >
      {children}
    </Cmp>
  );
}

/** Standalone on-load fade — the hero's desktop form column. */
export function LoadFade({
  children,
  className,
  y = 16,
  scale,
  duration = 0.7,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  scale?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={scale ? { opacity: 0, scale } : { opacity: 0, y }}
      animate={scale ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Soft looping float — hero cards / badges. Honours reduced motion. */
export function Float({
  children,
  className,
  amplitude = 8,
  duration = 4.2,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: 1,
        y: [0, -amplitude, 0],
      }}
      transition={{
        opacity: { duration: 0.6, ease: EASE, delay },
        y: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.6,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
