'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Send, Smartphone } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { BuilderField } from './types';

export function FormLivePreview({
  name,
  description,
  badgeText,
  submitLabel,
  buttonColor,
  backgroundColor,
  textColor,
  cornerRadius,
  spacing,
  fontSize,
  fields,
  previewMode,
  onPreviewModeChange,
  className,
}: {
  name: string;
  description: string;
  badgeText: string;
  submitLabel: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  cornerRadius: number;
  spacing: number;
  fontSize: 'sm' | 'md' | 'lg';
  fields: BuilderField[];
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  className?: string;
}) {
  const fontSizeClass = fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live preview
        </p>
        <div className="flex gap-1 rounded-lg border border-border bg-canvas p-0.5">
          <button
            type="button"
            onClick={() => onPreviewModeChange('desktop')}
            className={cn(
              'rounded-md p-1.5',
              previewMode === 'desktop' ? 'bg-surface text-ink shadow-sm' : 'text-muted'
            )}
            aria-label="Desktop preview"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onPreviewModeChange('mobile')}
            className={cn(
              'rounded-md p-1.5',
              previewMode === 'mobile' ? 'bg-surface text-ink shadow-sm' : 'text-muted'
            )}
            aria-label="Mobile preview"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 justify-center overflow-auto rounded-2xl border border-border bg-[linear-gradient(180deg,#eef3fb,#f8fafc)] p-6">
        <motion.div
          layout
          className={cn('w-full shadow-panel', fontSizeClass)}
          style={{
            maxWidth: previewMode === 'mobile' ? 320 : 480,
            borderRadius: cornerRadius + 8,
            backgroundColor,
            padding: 24,
          }}
        >
          {badgeText ? (
            <span
              className="mb-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: `${buttonColor}1a`, color: buttonColor }}
            >
              {badgeText}
            </span>
          ) : null}
          <h2 className="mb-1 text-lg font-extrabold tracking-tight" style={{ color: textColor }}>
            {name.trim() || 'Untitled form'}
          </h2>
          {description.trim() ? (
            <p className="mb-4 opacity-70" style={{ color: textColor }}>
              {description}
            </p>
          ) : (
            <div className="mb-4" />
          )}

          <div className="flex flex-col" style={{ gap: spacing }}>
            <AnimatePresence initial={false}>
              {fields.map((f) => (
                <motion.div
                  key={f.key}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <p className="mb-1 text-xs font-semibold" style={{ color: textColor }}>
                    {f.label} {f.required ? <span style={{ color: buttonColor }}>*</span> : null}
                  </p>
                  {f.type === 'textarea' ? (
                    <div
                      className="border border-black/10 bg-black/[0.03] px-3 py-2.5 text-xs opacity-55"
                      style={{ borderRadius: cornerRadius, minHeight: 64, color: textColor }}
                    >
                      {f.placeholder || `${f.label}…`}
                    </div>
                  ) : (
                    <div
                      className="border border-black/10 bg-black/[0.03] px-3 py-2.5 text-xs opacity-55"
                      style={{ borderRadius: cornerRadius, color: textColor }}
                    >
                      {f.placeholder || f.label}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div
            className="mt-5 flex h-11 items-center justify-center gap-1.5 text-sm font-bold text-white"
            style={{ backgroundColor: buttonColor, borderRadius: cornerRadius }}
          >
            {submitLabel.trim() || 'Send'} <Send className="h-3.5 w-3.5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
