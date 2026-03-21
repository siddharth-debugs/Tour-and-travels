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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, X } from "lucide-react";

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

export function PackageForm({ mode, packageId, destinations, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tag input state
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<PackageFormData>({
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
    },
  });

  const { fields: itineraryFields, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: "itinerary",
  });

  const inclusions = watch("inclusions");
  const exclusions = watch("exclusions");
  const featured = watch("featured");
  const images = watch("images");

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
          mode === "create"
            ? "Package created successfully"
            : "Package updated successfully"
        );
        router.push("/admin/packages");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Manali Snow Adventure" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Destination */}
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
              <p className="text-sm text-destructive">{errors.destinationId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Price */}
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

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g. 5 Days / 4 Nights"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>

            {/* Group Size */}
            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                placeholder="e.g. 2-10 People"
                {...register("groupSize")}
              />
              {errors.groupSize && (
                <p className="text-sm text-destructive">{errors.groupSize.message}</p>
              )}
            </div>

            {/* Category */}
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
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={(val) =>
                setValue("featured", val, { shouldValidate: true })
              }
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured package
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">Itinerary</CardTitle>
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
            Add Day
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {itineraryFields.map((field, index) => (
            <div
              key={field.id}
              className="relative rounded-lg border bg-muted/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Day {index + 1}
                </span>
                {itineraryFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeDay(index)}
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Remove day</span>
                  </Button>
                )}
              </div>
              <input
                type="hidden"
                value={index + 1}
                {...register(`itinerary.${index}.day` as const, { valueAsNumber: true })}
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
                    placeholder="Describe the day's activities..."
                    rows={2}
                    {...register(`itinerary.${index}.description` as const)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inclusions & Exclusions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Inclusions & Exclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Inclusions */}
          <div className="space-y-2">
            <Label>Inclusions</Label>
            <div className="flex gap-2">
              <Input
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                onKeyDown={(e) =>
                  handleTagKeyDown(e, "inclusions", inclusionInput, setInclusionInput)
                }
                placeholder="Type and press Enter or comma to add"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTag("inclusions", inclusionInput, setInclusionInput)}
              >
                Add
              </Button>
            </div>
            {inclusions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {inclusions.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag("inclusions", tag)}
                      className="ml-1 rounded-full hover:text-destructive"
                    >
                      <X className="size-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.inclusions && (
              <p className="text-sm text-destructive">{errors.inclusions.message}</p>
            )}
          </div>

          {/* Exclusions */}
          <div className="space-y-2">
            <Label>Exclusions</Label>
            <div className="flex gap-2">
              <Input
                value={exclusionInput}
                onChange={(e) => setExclusionInput(e.target.value)}
                onKeyDown={(e) =>
                  handleTagKeyDown(e, "exclusions", exclusionInput, setExclusionInput)
                }
                placeholder="Type and press Enter or comma to add"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTag("exclusions", exclusionInput, setExclusionInput)}
              >
                Add
              </Button>
            </div>
            {exclusions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {exclusions.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag("exclusions", tag)}
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
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">Images</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const current = images ?? [];
              setValue("images", [...current, ""], { shouldValidate: true });
            }}
          >
            <PlusCircle className="mr-2 size-4" />
            Add Image
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {(images ?? []).map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://..."
                {...register(`images.${index}` as const)}
              />
              {(images?.length ?? 0) > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => {
                    const current = [...(images ?? [])];
                    current.splice(index, 1);
                    setValue("images", current, { shouldValidate: true });
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Package"
            : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/packages")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
