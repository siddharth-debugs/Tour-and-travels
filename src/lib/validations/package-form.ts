import { z } from "zod";

const optionalStr = z
  .string()
  .trim()
  .max(255)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

const optionalLongStr = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

const optionalUrl = z
  .union([z.string().url(), z.literal("")])
  .optional()
  .transform((v) => (v ? v : undefined));

export const packageFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  destinationId: z.string().min(1, "Destination is required"),
  price: z.coerce.number().positive("Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  groupSize: z.string().min(1, "Group size is required"),
  category: z.string().min(1, "Category is required"),
  itinerary: z
    .array(
      z.object({
        day: z.number(),
        title: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1, "At least 1 day required"),
  inclusions: z.array(z.string()).min(1, "At least 1 inclusion required"),
  exclusions: z.array(z.string()),
  images: z.array(z.string().url()).min(1, "At least 1 image required"),
  featured: z.boolean().default(false),
  metaTitle: optionalStr,
  metaDescription: optionalLongStr,
  metaKeywords: optionalStr,
  ogImage: optionalUrl,
});

export type PackageFormData = z.infer<typeof packageFormSchema>;
