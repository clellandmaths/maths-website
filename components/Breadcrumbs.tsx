import Link from 'next/link';

// Slim breadcrumb trail for deep pages — answers "where am I" and gives
// every page a path back up. Doubles as the anchor for BreadcrumbList
// structured data when that lands.
export interface Crumb {
  label: string;
  href?: string; // last crumb (current page) and unlinkable levels omit this
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-muted-foreground/50">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground/70">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
