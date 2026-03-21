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
import { createDestination, updateDestination } from "@/app/actions/admin/destinations";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  mode: "create" | "edit";
  destinationId?: string;
  defaultValues?: Partial<DestinationFormData>;
}

export function DestinationForm({ mode, destinationId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      region: defaultValues?.region,
      image: defaultValues?.image ?? "",
      featured: defaultValues?.featured ?? false,
    },
  });

  const featured = watch("featured");

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
          mode === "create"
            ? "Destination created successfully"
            : "Destination updated successfully"
        );
        router.push("/admin/destinations");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-5 pt-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Manali"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the destination..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Region */}
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

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://..."
              {...register("image")}
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
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
              Featured destination
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Destination"
            : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/destinations")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
