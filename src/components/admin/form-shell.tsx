"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminFormTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface Props {
  tabs: AdminFormTab[];
  defaultTab?: string;
  isPending?: boolean;
  submitLabel: string;
  onCancel?: () => void;
  cancelLabel?: string;
  /** Bottom-left status (e.g. "Last saved 5 min ago") */
  status?: React.ReactNode;
  className?: string;
}

export function AdminFormShell({
  tabs,
  defaultTab,
  isPending,
  submitLabel,
  onCancel,
  cancelLabel = "Cancel",
  status,
  className,
}: Props) {
  return (
    <div className={cn("space-y-5", className)}>
      <Tabs defaultValue={defaultTab ?? tabs[0]?.value}>
        <TabsList variant="line" className="border-b border-border">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.icon}
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent
            key={t.value}
            value={t.value}
            className="mt-5 space-y-5"
          >
            {t.content}
          </TabsContent>
        ))}
      </Tabs>

      <div className="sticky bottom-0 z-10 -mx-6 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="text-xs text-muted-foreground">{status}</div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
