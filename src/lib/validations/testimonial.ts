import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
  avatar: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;
