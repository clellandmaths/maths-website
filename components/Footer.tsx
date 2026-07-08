import Link from 'next/link';

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

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
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

        <p className="font-mono text-xs text-muted-foreground/70 mt-8">
          © {new Date().getFullYear()} Clelland Maths
        </p>
      </div>
    </footer>
  );
}
