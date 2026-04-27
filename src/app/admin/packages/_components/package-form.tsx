"use client";

import { useState, useTransition, KeyboardEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  packageFormSchema,
  type PackageFormData,
} from "@/lib/validations/package-form";
import { CATEGORIES } from "@/lib/constants";
import { createPackage, updatePackage } from "@/app/actions/admin/packages";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminFormSection } from "@/components/admin/form-section";
import { AdminFormShell } from "@/components/admin/form-shell";
import { ImageGalleryInput } from "@/components/admin/image-input";
import { MetaFields } from "@/components/admin/meta-fields";
import { PlusCircle, Trash2, X, FileText, Search, Settings } from "lucide-react";

interface Destination {
  id: string;
  name: string;
}

interface Props {
  mode: "create" | "edit";
  packageId?: string;
  destinations: Destination[];
  defaultValues?: Partial<PackageFormData>;
}

export function PackageForm({
  mode,
  packageId,
  destinations,
  defaultValues,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<PackageFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(packageFormSchema) as any,
    defaultValues: {
      title: defaultValues?.title ?? "",
      destinationId: defaultValues?.destinationId ?? "",
      price: defaultValues?.price ?? undefined,
      duration: defaultValues?.duration ?? "",
      groupSize: defaultValues?.groupSize ?? "",
      category: defaultValues?.category ?? "",
      itinerary: defaultValues?.itinerary?.length
        ? defaultValues.itinerary
        : [{ day: 1, title: "", description: "" }],
      inclusions: defaultValues?.inclusions ?? [],
      exclusions: defaultValues?.exclusions ?? [],
      images: defaultValues?.images?.length ? defaultValues.images : [""],
      featured: defaultValues?.featured ?? false,
      metaTitle: defaultValues?.metaTitle ?? undefined,
      metaDescription: defaultValues?.metaDescription ?? undefined,
      metaKeywords: defaultValues?.metaKeywords ?? undefined,
      ogImage: defaultValues?.ogImage ?? undefined,
    },
  });

  const {
    fields: itineraryFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({ control, name: "itinerary" });

  const inclusions = watch("inclusions");
  const exclusions = watch("exclusions");
  const featured = watch("featured");
  const images = watch("images") ?? [];
  const title = watch("title");
  const meta = watch(["metaTitle", "metaDescription", "metaKeywords", "ogImage"]);

  function addTag(
    type: "inclusions" | "exclusions",
    inputValue: string,
    setter: (v: string) => void
  ) {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const current = type === "inclusions" ? inclusions : exclusions;
    if (current.includes(trimmed)) return;
    setValue(type, [...current, trimmed], { shouldValidate: true });
    setter("");
  }

  function removeTag(type: "inclusions" | "exclusions", tag: string) {
    const current = type === "inclusions" ? inclusions : exclusions;
    setValue(
      type,
      current.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  }

  function handleTagKeyDown(
    e: KeyboardEvent<HTMLInputElement>,
    type: "inclusions" | "exclusions",
    inputValue: string,
    setter: (v: string) => void
  ) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(type, inputValue, setter);
    }
  }

  function onSubmit(data: PackageFormData) {
    startTransition(async () => {
      try {
        const result =
          mode === "create"
            ? await createPackage(data)
            : await updatePackage(packageId!, data);

        if (!result.success) {
          toast.error(result.error ?? "Something went wrong");
          return;
        }
        toast.success(
          mode === "create" ? "Package created" : "Package saved"
        );
        router.push("/admin/packages");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  const contentTab = (
    <>
      <AdminFormSection
        title="Basic Information"
        description="Core attributes shown on listing pages and in search."
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Manali Snow Adventure"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="destinationId">Destination</Label>
            <Select
              defaultValue={defaultValues?.destinationId}
              onValueChange={(val) =>
                setValue("destinationId", val ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger id="destinationId">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinationId && (
              <p className="text-sm text-destructive">
                {errors.destinationId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue={defaultValues?.category}
              onValueChange={(val) =>
                setValue("category", val ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              placeholder="e.g. 15000"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g. 5 Days / 4 Nights"
              {...register("duration")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="groupSize">Group Size</Label>
            <Input
              id="groupSize"
              placeholder="e.g. 2-10 People"
              {...register("groupSize")}
            />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Itinerary"
        description="Plan a day-by-day breakdown for travelers."
      >
        <div className="space-y-3">
          {itineraryFields.map((field, index) => (
            <div
              key={field.id}
              className="relative rounded-lg border bg-muted/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="outline">Day {index + 1}</Badge>
                {itineraryFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => removeDay(index)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
              <input
                type="hidden"
                value={index + 1}
                {...register(`itinerary.${index}.day` as const, {
                  valueAsNumber: true,
                })}
              />
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    placeholder="e.g. Arrival & Local Sightseeing"
                    {...register(`itinerary.${index}.title` as const)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    placeholder="Describe the day's activities..."
                    {...register(`itinerary.${index}.description` as const)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendDay({
                day: itineraryFields.length + 1,
                title: "",
                description: "",
              })
            }
          >
            <PlusCircle className="mr-2 size-4" />
            Add day
          </Button>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Inclusions & Exclusions"
        description="What is and isn't covered in the package price."
      >
        <TagField
          label="Inclusions"
          values={inclusions}
          inputValue={inclusionInput}
          setInputValue={setInclusionInput}
          onAdd={() => addTag("inclusions", inclusionInput, setInclusionInput)}
          onRemove={(t) => removeTag("inclusions", t)}
          onKeyDown={(e) =>
            handleTagKeyDown(e, "inclusions", inclusionInput, setInclusionInput)
          }
          variant="secondary"
          placeholder="Type and press Enter or comma to add"
        />
        {errors.inclusions && (
          <p className="text-sm text-destructive">
            {errors.inclusions.message}
          </p>
        )}
        <TagField
          label="Exclusions"
          values={exclusions}
          inputValue={exclusionInput}
          setInputValue={setExclusionInput}
          onAdd={() => addTag("exclusions", exclusionInput, setExclusionInput)}
          onRemove={(t) => removeTag("exclusions", t)}
          onKeyDown={(e) =>
            handleTagKeyDown(e, "exclusions", exclusionInput, setExclusionInput)
          }
          variant="outline"
          placeholder="Type and press Enter or comma to add"
        />
      </AdminFormSection>

      <AdminFormSection
        title="Images"
        description="The first image is used as the package cover."
      >
        <ImageGalleryInput
          values={images}
          onChange={(next) =>
            setValue("images", next, { shouldValidate: true })
          }
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
      fallbackTitle={title || "Tour Package"}
    />
  );

  const settingsTab = (
    <AdminFormSection
      title="Visibility"
      description="Control where this package appears across the site."
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
            Featured package
          </Label>
          <p className="text-xs text-muted-foreground">
            Featured packages appear in the homepage carousel and at the top
            of the packages list.
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
        isPending={isPending}
        submitLabel={
          isPending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Package"
            : "Save Changes"
        }
        onCancel={() => router.push("/admin/packages")}
      />
    </form>
  );
}

interface TagFieldProps {
  label: string;
  values: string[];
  inputValue: string;
  setInputValue: (v: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  variant?: "secondary" | "outline";
  placeholder?: string;
}

function TagField({
  label,
  values,
  inputValue,
  setInputValue,
  onAdd,
  onRemove,
  onKeyDown,
  variant = "secondary",
  placeholder,
}: TagFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={onAdd}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((tag) => (
            <Badge key={tag} variant={variant} className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="ml-1 rounded-full hover:text-destructive"
              >
                <X className="size-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
