import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

/** Visible breadcrumb trail shared by calculator and guide pages. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-8 md:pt-12">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="h-3 w-3 shrink-0 text-muted" aria-hidden="true" />
              ) : null}
              {!last && item.href ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "font-medium text-foreground" : "text-muted"}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}