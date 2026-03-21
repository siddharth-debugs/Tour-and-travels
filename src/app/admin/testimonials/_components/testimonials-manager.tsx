"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  testimonialSchema,
  type TestimonialFormData,
} from "@/lib/validations/testimonial";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/actions/admin/testimonials";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string | null;
  rating: number;
  review: string;
  featured: boolean;
}

function AddTestimonialDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TestimonialFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(testimonialSchema) as any,
    defaultValues: {
      name: "",
      location: "",
      rating: 5,
      review: "",
      avatar: "",
      featured: false,
    },
  });

  function handleAdd(data: TestimonialFormData) {
    startTransition(async () => {
      const result = await createTestimonial(data);
      if (!result.success) {
        toast.error(result.error ?? "Failed to create testimonial");
        return;
      }
      toast.success("Testimonial created");
      form.reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <PlusCircle className="mr-2 size-4" />
            Add Testimonial
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new testimonial.
          </DialogDescription>
        </DialogHeader>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form onSubmit={form.handleSubmit(handleAdd as any)} className="space-y-4">
          <TestimonialFormFields form={form} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditTestimonialDialog({ testimonial }: { testimonial: Testimonial }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TestimonialFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(testimonialSchema) as any,
    defaultValues: {
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      review: testimonial.review,
      avatar: testimonial.avatar ?? "",
      featured: testimonial.featured,
    },
  });

  function handleEdit(data: TestimonialFormData) {
    startTransition(async () => {
      const result = await updateTestimonial(testimonial.id, data);
      if (!result.success) {
        toast.error(result.error ?? "Failed to update testimonial");
        return;
      }
      toast.success("Testimonial updated");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8" />
        }
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit</span>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Testimonial</DialogTitle>
          <DialogDescription>Update the testimonial details.</DialogDescription>
        </DialogHeader>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form onSubmit={form.handleSubmit(handleEdit as any)} className="space-y-4">
          <TestimonialFormFields form={form} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTestimonialDialog({ testimonial }: { testimonial: Testimonial }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteTestimonial(testimonial.id);
      toast.success("Testimonial deleted");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Delete</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Testimonial</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the testimonial from{" "}
            <span className="font-semibold">{testimonial.name}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  testimonials: Testimonial[];
  mode: "add-button" | "row-actions";
  testimonialId?: string;
}

export function TestimonialsManager({ testimonials, mode, testimonialId }: Props) {
  const testimonial = testimonialId
    ? testimonials.find((t) => t.id === testimonialId)
    : undefined;

  if (mode === "add-button") {
    return <AddTestimonialDialog />;
  }

  if (!testimonial) return null;

  return (
    <div className="flex items-center gap-2">
      <EditTestimonialDialog testimonial={testimonial} />
      <DeleteTestimonialDialog testimonial={testimonial} />
    </div>
  );
}

function TestimonialFormFields({
  form,
}: {
  form: ReturnType<typeof useForm<TestimonialFormData>>;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const featured = watch("featured");
  const rating = watch("rating");

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Customer name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input placeholder="e.g. Mumbai, India" {...register("location")} />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Rating</Label>
        <Select
          value={String(rating ?? 5)}
          onValueChange={(val) =>
            setValue("rating", Number(val), { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} Star{r > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.rating && (
          <p className="text-sm text-destructive">{errors.rating.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Review</Label>
        <Textarea
          placeholder="Customer's review..."
          rows={3}
          {...register("review")}
        />
        {errors.review && (
          <p className="text-sm text-destructive">{errors.review.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          Avatar URL{" "}
          <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input type="url" placeholder="https://..." {...register("avatar")} />
        {errors.avatar && (
          <p className="text-sm text-destructive">{errors.avatar.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="t-featured"
          checked={featured}
          onCheckedChange={(val) =>
            setValue("featured", val, { shouldValidate: true })
          }
        />
        <Label htmlFor="t-featured" className="cursor-pointer">
          Featured testimonial
        </Label>
      </div>
    </>
  );
}
