'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';

type UploadResponse = { ok: boolean; url: string; fileName: string; mimeType: string; size: number };

export function FileUpload({ videoOnly = false, disabled = false, onUploaded, onUploadingChange, onSelectionChange }: {
  videoOnly?: boolean;
  disabled?: boolean;
  onUploaded: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  onSelectionChange: () => void;
}) {
  const id = useId();
  const controller = useRef<AbortController | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(0);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  useEffect(() => () => controller.current?.abort(), []);

  async function start(selected: File) {
    if (controller.current || disabled) return;
    setFile(selected);
    setComplete(false);
    setError('');
    onSelectionChange();
    const extensions = videoOnly ? /\.(mp4|webm|mov)$/i : /\.(mp4|webm|mov|pdf|docx?|pptx?|jpe?g|png|webp|txt)$/i;
    if (!extensions.test(selected.name)) {
      setError('Unsupported file format. Choose one of the formats listed below.');
      return;
    }
    if (selected.size > 200 * 1024 * 1024 || selected.size === 0) {
      setError(selected.size === 0 ? 'This file is empty.' : 'File is too large. Maximum size is 200 MiB (209,715,200 bytes).');
      return;
    }
    const abortController = new AbortController();
    controller.current = abortController;
    setProgress(0);
    setUploading(true);
    onUploadingChange(true);
    try {
      const res = await adminApi.upload<UploadResponse>('/api/admin/portal/upload', selected, {
        signal: abortController.signal,
        onProgress: setProgress,
      });
      if (!res.ok) { setError(res.error); return; }
      if (!res.data.ok || !res.data.url) { setError('The server did not confirm a file URL. Please retry explicitly.'); return; }
      onUploaded(res.data.url);
      setComplete(true);
    } finally {
      controller.current = null;
      setUploading(false);
      onUploadingChange(false);
    }
  }

  return (
    <div className="min-w-0 space-y-3 rounded-xl border border-border bg-surface p-4">
      <label htmlFor={id} className="block text-sm font-bold text-ink">Choose {videoOnly ? 'video' : 'file'}</label>
      <input id={id} type="file" disabled={disabled || uploading}
        accept={videoOnly ? '.mp4,.webm,.mov' : '.mp4,.webm,.mov,.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.txt'}
        className="block min-h-11 w-full min-w-0 max-w-full text-sm file:mr-2 file:min-h-11 file:rounded-lg file:border file:border-border file:bg-white file:px-3 file:text-ink"
        onChange={(event) => { const selected = event.target.files?.[0]; event.target.value = ''; if (selected) void start(selected); }} />
      <p className="text-xs leading-relaxed text-muted">{videoOnly ? 'MP4, WebM, MOV' : 'MP4, WebM, MOV, PDF, DOC/DOCX, PPT/PPTX, JPG, PNG, WebP, TXT'}. Maximum 200 MiB.</p>
      {file && <p className="break-all text-sm text-ink">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MiB</p>}
      {uploading && <div className="space-y-2">
        <progress aria-label="File upload progress" max={100} value={progress ?? undefined} className="h-3 w-full accent-brand" />
        <p role="status" className="text-sm text-muted">{progress === 100 ? 'File sent. Waiting for server confirmation…' : progress === null ? 'Uploading…' : `Uploading ${progress}%`}</p>
        <Button type="button" variant="outline" className="min-h-11" onClick={() => controller.current?.abort()}>Cancel upload</Button>
      </div>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {error && file && <Button type="button" variant="outline" className="min-h-11" disabled={disabled || uploading} onClick={() => void start(file)}>Retry upload</Button>}
      {complete && <p role="status" className="text-sm text-emerald-700">Upload complete. Save the form to publish it.</p>}
      <p className="text-xs leading-relaxed text-muted">Cancelling stops this request, but may leave a file already received by the server. Uploads are not retried automatically.</p>
    </div>
  );
}
