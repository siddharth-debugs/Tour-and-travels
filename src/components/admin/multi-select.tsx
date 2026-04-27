"use client";

import { useState, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, X, Check, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  imageUrl?: string;
}

interface Props {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  /** Render selected items with their original order preserved */
  preserveOrder?: boolean;
  className?: string;
  maxHeight?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  emptyText = "No items found.",
  searchPlaceholder = "Search...",
  preserveOrder = true,
  className,
  maxHeight = "20rem",
}: Props) {
  const [open, setOpen] = useState(false);

  const optionMap = useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options]
  );

  function toggle(v: string) {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange(preserveOrder ? [...value, v] : [...value, v]);
    }
  }

  function remove(v: string) {
    onChange(value.filter((x) => x !== v));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              <span className="truncate text-muted-foreground">
                {value.length > 0
                  ? `${value.length} selected`
                  : placeholder}
              </span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width,400px)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList style={{ maxHeight }}>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const checked = value.includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      value={`${opt.label} ${opt.description ?? ""}`}
                      onSelect={() => toggle(opt.value)}
                      data-checked={checked}
                      className="flex items-center gap-3 py-2"
                    >
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background"
                        )}
                      >
                        {checked && <Check className="size-3.5" />}
                      </div>
                      {opt.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={opt.imageUrl}
                          alt=""
                          className="size-9 shrink-0 rounded-md object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-2">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {value.length} selected · drag handles or arrows to reorder
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </button>
          </div>
          <ul className="space-y-1">
            {value.map((v, idx) => {
              const opt = optionMap.get(v);
              if (!opt) return null;
              return (
                <li
                  key={v}
                  className="group flex items-center gap-2 rounded-md bg-background px-2 py-1.5 ring-1 ring-border"
                >
                  <span className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <GripVertical className="size-3 rotate-90" />
                    </button>
                  </span>
                  <Badge
                    variant="secondary"
                    className="size-5 justify-center p-0 text-[10px] tabular-nums"
                  >
                    {idx + 1}
                  </Badge>
                  {opt.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={opt.imageUrl}
                      alt=""
                      className="size-7 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{opt.label}</div>
                    {opt.description && (
                      <div className="truncate text-[11px] text-muted-foreground">
                        {opt.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(v)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
