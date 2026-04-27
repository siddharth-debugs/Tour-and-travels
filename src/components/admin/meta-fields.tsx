"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormSection } from "./form-section";

export interface MetaValues {
  metaTitle?: string | null | undefined;
  metaDescription?: string | null | undefined;
  metaKeywords?: string | null | undefined;
  ogImage?: string | null | undefined;
}

interface Props {
  value: MetaValues;
  onChange: (next: MetaValues) => void;
  /** Title used in the live preview when metaTitle is empty */
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function MetaFields({
  value,
  onChange,
  fallbackTitle,
  fallbackDescription,
}: Props) {
  const set = <K extends keyof MetaValues>(k: K, v: MetaValues[K]) =>
    onChange({ ...value, [k]: v });

  const previewTitle = value.metaTitle?.trim() || fallbackTitle || "Untitled";
  const previewDesc =
    value.metaDescription?.trim() ||
    fallbackDescription ||
    "Your page meta description will appear here.";

  return (
    <div className="space-y-5">
      <AdminFormSection
        title="Search Engine Optimization"
        description="Customize how this page appears in Google and on social shares. Leave blank to fall back to defaults."
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {(value.metaTitle ?? "").length}/60
            </span>
          </div>
          <Input
            id="metaTitle"
            placeholder="e.g. Manali Snow Adventure | WanderQuest"
            value={value.metaTitle ?? ""}
            onChange={(e) => set("metaTitle", e.target.value)}
            maxLength={70}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {(value.metaDescription ?? "").length}/160
            </span>
          </div>
          <Textarea
            id="metaDescription"
            rows={3}
            placeholder="A short, compelling summary shown in search results."
            value={value.metaDescription ?? ""}
            onChange={(e) => set("metaDescription", e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaKeywords">Keywords</Label>
          <Input
            id="metaKeywords"
            placeholder="manali, himachal, adventure, snow"
            value={value.metaKeywords ?? ""}
            onChange={(e) => set("metaKeywords", e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Comma-separated. Used as fallback signal for some crawlers.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ogImage">Social Share Image (Open Graph)</Label>
          <Input
            id="ogImage"
            type="url"
            placeholder="https://res.cloudinary.com/..."
            value={value.ogImage ?? ""}
            onChange={(e) => set("ogImage", e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            1200×630 recommended. Falls back to the main image.
          </p>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Search Preview"
        description="A live preview of how this page may appear on Google."
      >
        <div className="rounded-lg border bg-background p-4">
          <div className="text-xs text-emerald-700">
            wanderquest.com › ...
          </div>
          <div className="mt-1 truncate text-base text-blue-700 hover:underline">
            {previewTitle}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {previewDesc}
          </p>
        </div>
      </AdminFormSection>
    </div>
  );
}
