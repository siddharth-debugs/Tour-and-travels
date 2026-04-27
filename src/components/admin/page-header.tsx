import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {c.href ? (
                <Link
                  href={c.href}
                  className="hover:text-foreground transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground">{c.label}</span>
              )}
              {i < breadcrumbs.length - 1 && (
                <ChevronRight className="size-3" />
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
