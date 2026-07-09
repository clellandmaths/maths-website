'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import type { CourseTheme } from '@/lib/course-theme';

function getTimestampSeconds(ts: string): number {
  if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
  if (ts.includes(':')) {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  }
  return parseInt(ts, 10) || 0;
}

interface Props {
  theme: CourseTheme;
  videoId: string;
  timestamp: string;
  title: string;
}

export default function WatchSolutionButton({ theme, videoId, timestamp, title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-sm font-medium transition-colors`}
      >
        <Play className="h-4 w-4" />
        Watch Solution
      </button>
      {open && (
        <VideoModal
          isOpen={true}
          onClose={() => setOpen(false)}
          videoId={videoId}
          timestamp={getTimestampSeconds(timestamp)}
          title={title}
        />
      )}
    </>
  );
}
