import Link from 'next/link';
import { QS_COPYRIGHT_NOTICE, QS_NOTICE_SCOPE } from '@/lib/exam-board';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <img
              src="/img/logo/clelland-maths-logo.png"
              alt="Clelland Maths"
              className="h-9 w-auto mb-2"
              loading="lazy"
            />
            <p className="text-sm text-muted-foreground">
              Free maths revision for Scottish students.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Courses</span>
              <Link href="/course/n5" className="hover:text-foreground transition-colors">National 5</Link>
              <Link href="/course/higher" className="hover:text-foreground transition-colors">Higher</Link>
              <Link href="/course/ah" className="hover:text-foreground transition-colors">Advanced Higher</Link>
              <Link href="/course/n5-apps" className="hover:text-foreground transition-colors">N5 Applications</Link>
              <Link href="/course/higher-apps" className="hover:text-foreground transition-colors">Higher Applications</Link>
            </nav>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Tools</span>
              <Link href="/explorer" className="hover:text-foreground transition-colors">Topic Explorer</Link>
              <Link href="/exam-hall" className="hover:text-foreground transition-colors">Exam Hall</Link>
              <a
                href="https://app.clellandmaths.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Revision App
              </a>
              <a
                href="https://academy.clellandmaths.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Academy
              </a>
            </nav>
          </div>
        </div>

        {/* Attributions. Both are conditions of using the material rather than
            courtesies, so they sit on every page rather than on an about page
            nobody opens. */}
        <div className="mt-8 pt-6 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground">
            Guided practice questions ©{' '}
            <a
              href="https://www.maths.scot"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              maths.scot
            </a>
            , used with permission. An outstanding resource for learners and teachers.
          </p>
          <p className="text-xs text-muted-dim">
            {QS_NOTICE_SCOPE} {QS_COPYRIGHT_NOTICE}
          </p>
        </div>

        <p className="font-mono text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} Clelland Maths
        </p>
      </div>
    </footer>
  );
}
