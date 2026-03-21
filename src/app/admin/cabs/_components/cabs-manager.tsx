"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cabTypeSchema, type CabTypeFormData } from "@/lib/validations/cab-type";
import { createCabType, updateCabType, deleteCabType } from "@/app/actions/admin/cabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface CabType {
  id: string;
  name: string;
  description: string;
  pricePerKm: number;
  capacity: number;
  image: string;
}

interface Props {
  cabTypes: CabType[];
  mode: "add-button" | "row-actions";
  cabId?: string;
}

function AddCabDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CabTypeFormData>({
    resolver: zodResolver(cabTypeSchema) as any,
    defaultValues: { name: "", description: "", pricePerKm: 0, capacity: 1, image: "" },
  });

  function handleAdd(data: CabTypeFormData) {
    startTransition(async () => {
      const result = await createCabType(data);
      if (!result.success) {
        toast.error(result.error ?? "Failed to create cab type");
        return;
      }
      toast.success("Cab type created");
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
            Add Cab Type
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Cab Type</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new cab type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleAdd as any)} className="space-y-4">
          <CabTypeFormFields form={form} />
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

function EditCabDialog({ cab }: { cab: CabType }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CabTypeFormData>({
    resolver: zodResolver(cabTypeSchema) as any,
    defaultValues: {
      name: cab.name,
      description: cab.description,
      pricePerKm: cab.pricePerKm,
      capacity: cab.capacity,
      image: cab.image,
    },
  });

  function handleEdit(data: CabTypeFormData) {
    startTransition(async () => {
      const result = await updateCabType(cab.id, data);
      if (!result.success) {
        toast.error(result.error ?? "Failed to update cab type");
        return;
      }
      toast.success("Cab type updated");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Cab Type</DialogTitle>
          <DialogDescription>Update the cab type details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleEdit as any)} className="space-y-4">
          <CabTypeFormFields form={form} />
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

function DeleteCabDialog({ cab }: { cab: CabType }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteCabType(cab.id);
      toast.success("Cab type deleted");
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
          <DialogTitle>Delete Cab Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{cab.name}</span>? This action
            cannot be undone.
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

export function CabsManager({ cabTypes, mode, cabId }: Props) {
  const cab = cabId ? cabTypes.find((c) => c.id === cabId) : undefined;

  if (mode === "add-button") {
    return <AddCabDialog />;
  }

  if (!cab) return null;

  return (
    <div className="flex items-center gap-2">
      <EditCabDialog cab={cab} />
      <DeleteCabDialog cab={cab} />
    </div>
  );
}

function CabTypeFormFields({ form }: { form: ReturnType<typeof useForm<CabTypeFormData>> }) {
  const { register, formState: { errors } } = form;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cab-name">Name</Label>
        <Input id="cab-name" placeholder="e.g. Sedan" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cab-description">Description</Label>
        <Textarea id="cab-description" placeholder="Describe the cab type..." {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cab-price">Price / km (₹)</Label>
          <Input id="cab-price" type="number" step="0.01" min={0} placeholder="e.g. 12.50" {...register("pricePerKm")} />
          {errors.pricePerKm && <p className="text-sm text-destructive">{errors.pricePerKm.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cab-capacity">Capacity (seats)</Label>
          <Input id="cab-capacity" type="number" min={1} placeholder="e.g. 4" {...register("capacity")} />
          {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cab-image">Image URL</Label>
        <Input id="cab-image" type="url" placeholder="https://..." {...register("image")} />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
      </div>
    </>
  );
}
