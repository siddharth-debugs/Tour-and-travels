import { z } from "zod";

export const cabTypeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerKm: z.coerce.number().positive("Price must be positive"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  image: z.string().url("Valid image URL required"),
});

export type CabTypeFormData = z.infer<typeof cabTypeSchema>;
