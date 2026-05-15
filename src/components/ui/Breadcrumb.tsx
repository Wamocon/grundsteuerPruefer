import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-[var(--muted)]">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:text-[var(--foreground)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-[var(--foreground)] font-medium" : ""}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
