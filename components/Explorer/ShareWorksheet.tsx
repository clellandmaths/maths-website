'use client';

import { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { shareLinks, NO_OPTIONS, type WorksheetOptions } from '@/lib/worksheet-share';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

interface Props {
  theme: CourseTheme;
  courseId: string;
  questions: QuestionWithMetadata[];
  onClose: () => void;
}

/**
 * Two links for a finished worksheet.
 *
 * Editable hands over a working copy — it opens in the recipient's own
 * Explorer, where they can add, remove and reorder. Locked is a handout: a
 * fixed list under a title the sender types, with no editing controls.
 *
 * Both are just the question references in a query string, so neither expires
 * and nothing is stored anywhere.
 */
export default function ShareWorksheet({ theme, courseId, questions, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<WorksheetOptions>(NO_OPTIONS);
  const [copied, setCopied] = useState<'editable' | 'locked' | null>(null);

  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const links = shareLinks(origin, courseId, questions, title, options);
  const withVideo = questions.filter(q => q.videoId).length;

  const toggle = (key: keyof WorksheetOptions) =>
    setOptions(o => ({ ...o, [key]: !o[key] }));

  const check = (key: keyof WorksheetOptions, label: string, hint: string, disabled = false) => (
    <label className={`flex items-start gap-3 p-3 rounded-lg border border-border ${disabled ? 'opacity-50' : 'cursor-pointer hover:bg-white/5'} transition-colors`}>
      <input
        type="checkbox"
        checked={options[key]}
        disabled={disabled}
        onChange={() => toggle(key)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-current"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  );

  const copy = async (which: 'editable' | 'locked') => {
    try {
      await navigator.clipboard.writeText(links[which]);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard blocked (http, or permission denied) — the field is
      // selectable, so the link is still gettable by hand
    }
  };

  const row = (
    which: 'editable' | 'locked',
    heading: string,
    blurb: string,
  ) => (
    <div className="rounded-xl border border-border p-4">
      <p className="font-medium mb-1">{heading}</p>
      <p className="text-sm text-muted-foreground mb-3">{blurb}</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={links[which]}
          onFocus={e => e.currentTarget.select()}
          className="flex-1 min-w-0 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-slate-300"
        />
        <button
          onClick={() => copy(which)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 ${theme.bg} ${theme.bgHover} text-white text-sm font-medium rounded-lg transition-colors`}
        >
          {copied === which ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied === which ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 p-5 border-b border-border">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Share2 className={`h-5 w-5 ${theme.text}`} />
            Share this worksheet
          </h2>
          <button onClick={onClose} className="p-1.5 text-muted-dim hover:text-foreground rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            {questions.length} question{questions.length === 1 ? '' : 's'}. Both links carry the
            worksheet itself, so they keep working and nothing needs an account.
          </p>

          <div>
            <label htmlFor="ws-title" className="block text-sm font-medium mb-1.5">
              Title for the handout
            </label>
            <input
              id="ws-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Mr Cloud's Higher Maths Homework"
              maxLength={80}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-1.5">What pupils get</p>
            <p className="text-xs text-muted-foreground mb-2">
              Your choice, not theirs — these are fixed in the handout link and cannot be
              switched on at the other end. Pupils can always work through it full screen.
            </p>
            <div className="grid sm:grid-cols-3 gap-2">
              {check('answers', 'Answers', 'They can reveal the answer to each question')}
              {check('video', 'Video solutions', withVideo
                ? `A watch button on the ${withVideo} question${withVideo === 1 ? '' : 's'} that have one`
                : 'None of these questions has a video', withVideo === 0)}
              {check('qrCodes', 'QR codes', 'Printed beside each question, linking to its video', withVideo === 0)}
            </div>
          </div>

          {row('locked', 'Locked handout',
            'Opens as a fixed worksheet under your title, ready to print. No editing controls.')}
          {row('editable', 'Editable copy',
            'Opens in their Explorer with these questions already added, so they can change it.')}
        </div>
      </div>
    </div>
  );
}
