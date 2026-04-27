"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, PlusCircle } from "lucide-react";

interface SingleProps {
  label?: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}

export function ImageInput({
  label = "Image URL",
  description,
  value,
  onChange,
  required,
  error,
}: SingleProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="flex gap-3">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted/40">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="size-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImagePlus className="size-6" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <Input
            type="url"
            placeholder="https://res.cloudinary.com/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface GalleryProps {
  label?: string;
  values: string[];
  onChange: (next: string[]) => void;
}

export function ImageGalleryInput({
  label = "Gallery Images",
  values,
  onChange,
}: GalleryProps) {
  function update(idx: number, v: string) {
    const next = [...values];
    next[idx] = v;
    onChange(next);
  }
  function remove(idx: number) {
    const next = [...values];
    next.splice(idx, 1);
    onChange(next.length ? next : [""]);
  }
  function add() {
    onChange([...values, ""]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <PlusCircle className="mr-2 size-4" />
          Add image
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {values.map((v, idx) => (
          <div
            key={idx}
            className="flex gap-2 rounded-lg border bg-muted/20 p-2"
          >
            <div className="size-16 shrink-0 overflow-hidden rounded bg-muted/40">
              {v ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v}
                  alt=""
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                  }}
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImagePlus className="size-5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Input
                type="url"
                placeholder="https://..."
                value={v}
                onChange={(e) => update(idx, e.target.value)}
              />
            </div>
            {values.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => remove(idx)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
