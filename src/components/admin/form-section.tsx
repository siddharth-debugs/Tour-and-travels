import { cn } from "@/lib/utils";

export interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormSection({
  title,
  description,
  children,
  className,
}: AdminFormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <header className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
