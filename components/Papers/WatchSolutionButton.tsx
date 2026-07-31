'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import type { CourseTheme } from '@/lib/course-theme';
import { timestampToSeconds } from '@/lib/timestamp';

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
          timestamp={timestampToSeconds(timestamp)}
          title={title}
        />
      )}
    </>
  );
}
