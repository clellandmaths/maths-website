'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { examDiet, daysUntilDiet } from '@/lib/exam-dates';

export default function CountdownTile() {
  // null until mounted — avoids hydration mismatch on a static export
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntilDiet());
  }, []);

  return (
    <Link href="/exam-hall" className="group block h-full">
      <div className="h-full bg-card border border-border rounded-xl p-6 flex flex-col justify-between transition-colors group-hover:border-white/25">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-widest">
            {examDiet.year} exam diet{examDiet.estimated ? ' · est.' : ''}
          </span>
        </div>
        <div className="py-4">
          <span className="font-mono text-5xl font-bold text-foreground tabular-nums">
            {days ?? '—'}
          </span>
          <span className="ml-2 text-muted-foreground">days to go</span>
        </div>
        <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
          Open the Exam Hall →
        </span>
      </div>
    </Link>
  );
}
