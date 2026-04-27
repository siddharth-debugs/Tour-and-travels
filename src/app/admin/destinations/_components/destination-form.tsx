"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  destinationSchema,
  type DestinationFormData,
} from "@/lib/validations/destination";
import { REGIONS } from "@/lib/constants";
import {
  createDestination,
  updateDestination,
} from "@/app/actions/admin/destinations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { ImageInput } from "@/components/admin/image-input";
import { MetaFields } from "@/components/admin/meta-fields";
import { FileText, Search, Settings } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  destinationId?: string;
  defaultValues?: Partial<DestinationFormData>;
}

export function DestinationForm({
  mode,
  destinationId,
  defaultValues,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DestinationFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(destinationSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      region: defaultValues?.region,
      image: defaultValues?.image ?? "",
      featured: defaultValues?.featured ?? false,
      metaTitle: defaultValues?.metaTitle ?? undefined,
      metaDescription: defaultValues?.metaDescription ?? undefined,
      metaKeywords: defaultValues?.metaKeywords ?? undefined,
      ogImage: defaultValues?.ogImage ?? undefined,
    },
  });

  const featured = watch("featured");
  const image = watch("image");
  const name = watch("name");
  const meta = watch(["metaTitle", "metaDescription", "metaKeywords", "ogImage"]);

  function onSubmit(data: DestinationFormData) {
    startTransition(async () => {
      try {
        const result =
          mode === "create"
            ? await createDestination(data)
            : await updateDestination(destinationId!, data);

        if (!result.success) {
          toast.error(result.error ?? "Something went wrong");
          return;
        }
        toast.success(
          mode === "create" ? "Destination created" : "Destination saved"
        );
        router.push("/admin/destinations");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  const contentTab = (
    <>
      <AdminFormSection
        title="Basic Information"
        description="The destination name, region, and description shown on cards and the detail page."
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. Manali" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            defaultValue={defaultValues?.region}
            onValueChange={(val) =>
              setValue("region", val as DestinationFormData["region"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && (
            <p className="text-sm text-destructive">{errors.region.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Describe the destination..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Cover Image"
        description="Used on destination cards and at the top of the detail page."
      >
        <ImageInput
          label="Image URL"
          required
          value={image ?? ""}
          onChange={(v) => setValue("image", v, { shouldValidate: true })}
          error={errors.image?.message}
        />
      </AdminFormSection>
    </>
  );

  const seoTab = (
    <MetaFields
      value={{
        metaTitle: meta[0],
        metaDescription: meta[1],
        metaKeywords: meta[2],
        ogImage: meta[3],
      }}
      onChange={(m) => {
        setValue("metaTitle", m.metaTitle ?? undefined);
        setValue("metaDescription", m.metaDescription ?? undefined);
        setValue("metaKeywords", m.metaKeywords ?? undefined);
        setValue("ogImage", m.ogImage ?? undefined);
      }}
      fallbackTitle={name || "Destination"}
    />
  );

  const settingsTab = (
    <AdminFormSection
      title="Visibility"
      description="Highlight this destination across the site."
    >
      <div className="flex items-start gap-3">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={(val) =>
            setValue("featured", val, { shouldValidate: true })
          }
        />
        <div className="space-y-0.5">
          <Label htmlFor="featured" className="cursor-pointer">
            Featured destination
          </Label>
          <p className="text-xs text-muted-foreground">
            Featured destinations are surfaced on the homepage and at the top
            of the destinations grid.
          </p>
        </div>
      </div>
    </AdminFormSection>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        tabs={[
          {
            value: "content",
            label: "Content",
            icon: <FileText />,
            content: contentTab,
          },
          { value: "seo", label: "SEO", icon: <Search />, content: seoTab },
          {
            value: "settings",
            label: "Settings",
            icon: <Settings />,
            content: settingsTab,
          },
        ]}
        isPending={isPending}
        submitLabel={
          isPending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Destination"
            : "Save Changes"
        }
        onCancel={() => router.push("/admin/destinations")}
      />
    </form>
  );
}
