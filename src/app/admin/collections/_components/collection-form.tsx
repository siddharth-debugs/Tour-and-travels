"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  collectionSchema,
  type CollectionFormData,
} from "@/lib/validations/collection";
import {
  createCollection,
  updateCollection,
} from "@/app/actions/admin/collections";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminFormSection } from "@/components/admin/form-section";
import { AdminFormShell } from "@/components/admin/form-shell";
import { MultiSelect } from "@/components/admin/multi-select";
import { ImageInput } from "@/components/admin/image-input";
import { MetaFields } from "@/components/admin/meta-fields";
import { FileText, Search, Settings, Layers } from "lucide-react";

export interface PackageOption {
  id: string;
  title: string;
  destinationName: string;
  image?: string | null;
}
export interface DestinationOption {
  id: string;
  name: string;
  region: string;
  image?: string | null;
}

interface Props {
  mode: "create" | "edit";
  id?: string;
  packages: PackageOption[];
  destinations: DestinationOption[];
  defaults?: Partial<CollectionFormData>;
}

const empty: CollectionFormData = {
  type: "PACKAGE",
  name: "",
  tagline: undefined,
  description: undefined,
  content: undefined,
  image: undefined,
  showInNav: true,
  featured: false,
  order: 0,
  metaTitle: undefined,
  metaDescription: undefined,
  metaKeywords: undefined,
  ogImage: undefined,
  packageIds: [],
  destinationIds: [],
};

export function CollectionForm({
  mode,
  id,
  packages,
  destinations,
  defaults,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<CollectionFormData>({
    ...empty,
    ...defaults,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const update = <K extends keyof CollectionFormData>(
    k: K,
    v: CollectionFormData[K]
  ) => setData((d) => ({ ...d, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = collectionSchema.safeParse(data);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        flat[issue.path.join(".")] = issue.message;
      }
      setErrors(flat);
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setErrors({});
    startTransition(async () => {
      try {
        const result =
          mode === "create"
            ? await createCollection(parsed.data)
            : await updateCollection(id!, parsed.data);
        if (!result.success) {
          toast.error(result.error ?? "Something went wrong");
          return;
        }
        toast.success(
          mode === "create" ? "Collection created" : "Collection saved"
        );
        router.push("/admin/collections");
        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  const packageOptions = packages.map((p) => ({
    value: p.id,
    label: p.title,
    description: p.destinationName,
    imageUrl: p.image ?? undefined,
  }));

  const destinationOptions = destinations.map((d) => ({
    value: d.id,
    label: d.name,
    description: d.region,
    imageUrl: d.image ?? undefined,
  }));

  const contentTab = (
    <>
      <AdminFormSection
        title="Basic Information"
        description="The name, type, and primary copy that describes this collection."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Collection Type</Label>
            <Select
              value={data.type}
              onValueChange={(v) =>
                update("type", v as CollectionFormData["type"])
              }
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PACKAGE">Package Collection</SelectItem>
                <SelectItem value="DESTINATION">
                  Destination Collection
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Determines whether this collection groups packages or
              destinations, and where it appears in the public navbar.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Honeymoon Specials"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            placeholder="A short one-liner shown beneath the title"
            value={data.tagline ?? ""}
            onChange={(e) => update("tagline", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="A 1–2 sentence summary used on listing cards."
            value={data.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Long-form Content</Label>
          <Textarea
            id="content"
            rows={8}
            placeholder="Rich content shown on the collection page. Markdown supported."
            value={data.content ?? ""}
            onChange={(e) => update("content", e.target.value)}
          />
        </div>

        <ImageInput
          label="Hero Image"
          description="Used as the cover image on the collection page."
          value={data.image ?? ""}
          onChange={(v) => update("image", v)}
        />
      </AdminFormSection>

      <AdminFormSection
        title={
          data.type === "PACKAGE"
            ? "Packages in this Collection"
            : "Destinations in this Collection"
        }
        description={
          data.type === "PACKAGE"
            ? "Search and check the tour packages to feature. Reorder using the controls."
            : "Search and check the destinations to feature. Reorder using the controls."
        }
      >
        {data.type === "PACKAGE" ? (
          <MultiSelect
            options={packageOptions}
            value={data.packageIds}
            onChange={(v) => update("packageIds", v)}
            placeholder="Choose packages..."
            searchPlaceholder="Search packages by title or destination..."
            emptyText="No packages match. Try another search."
          />
        ) : (
          <MultiSelect
            options={destinationOptions}
            value={data.destinationIds}
            onChange={(v) => update("destinationIds", v)}
            placeholder="Choose destinations..."
            searchPlaceholder="Search destinations by name or region..."
            emptyText="No destinations match. Try another search."
          />
        )}
      </AdminFormSection>
    </>
  );

  const seoTab = (
    <MetaFields
      value={{
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        ogImage: data.ogImage,
      }}
      onChange={(meta) =>
        setData((d) => ({
          ...d,
          metaTitle: meta.metaTitle ?? undefined,
          metaDescription: meta.metaDescription ?? undefined,
          metaKeywords: meta.metaKeywords ?? undefined,
          ogImage: meta.ogImage ?? undefined,
        }))
      }
      fallbackTitle={data.name || "Collection"}
      fallbackDescription={data.description ?? data.tagline ?? undefined}
    />
  );

  const settingsTab = (
    <AdminFormSection
      title="Visibility & Display"
      description="Control how and where this collection is shown on the public site."
    >
      <div className="flex items-start gap-3">
        <Switch
          checked={data.showInNav}
          onCheckedChange={(v) => update("showInNav", v)}
          id="showInNav"
        />
        <div className="space-y-0.5">
          <Label htmlFor="showInNav" className="cursor-pointer">
            Show in navbar
          </Label>
          <p className="text-xs text-muted-foreground">
            Adds this collection as a dropdown item under{" "}
            {data.type === "PACKAGE" ? '"Packages"' : '"Destinations"'} in the
            site header.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Switch
          checked={data.featured}
          onCheckedChange={(v) => update("featured", v)}
          id="featured"
        />
        <div className="space-y-0.5">
          <Label htmlFor="featured" className="cursor-pointer">
            Featured
          </Label>
          <p className="text-xs text-muted-foreground">
            Highlights this collection on the homepage and listing pages.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          min={0}
          className="max-w-[140px]"
          value={data.order}
          onChange={(e) =>
            update("order", parseInt(e.target.value || "0", 10))
          }
        />
        <p className="text-[11px] text-muted-foreground">
          Lower numbers appear first. Defaults to 0.
        </p>
      </div>
    </AdminFormSection>
  );

  return (
    <form onSubmit={handleSubmit}>
      <AdminFormShell
        tabs={[
          {
            value: "content",
            label: "Content",
            icon: <FileText />,
            content: contentTab,
          },
          {
            value: "seo",
            label: "SEO",
            icon: <Search />,
            content: seoTab,
          },
          {
            value: "settings",
            label: "Settings",
            icon: <Settings />,
            content: settingsTab,
          },
        ]}
        defaultTab="content"
        isPending={isPending}
        submitLabel={
          isPending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Collection"
            : "Save Changes"
        }
        onCancel={() => router.push("/admin/collections")}
        status={
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5" />
            {data.type === "PACKAGE"
              ? `${data.packageIds.length} package${
                  data.packageIds.length === 1 ? "" : "s"
                } selected`
              : `${data.destinationIds.length} destination${
                  data.destinationIds.length === 1 ? "" : "s"
                } selected`}
          </span>
        }
      />
    </form>
  );
}
