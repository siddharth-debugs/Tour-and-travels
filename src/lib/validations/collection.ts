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
  .max(5000)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

const optionalUrl = z
  .union([z.string().url(), z.literal("")])
  .optional()
  .transform((v) => (v ? v : undefined));

export const collectionSchema = z.object({
  type: z.enum(["PACKAGE", "DESTINATION"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: optionalStr,
  description: optionalLongStr,
  content: optionalLongStr,
  image: optionalUrl,
  showInNav: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  metaTitle: optionalStr,
  metaDescription: optionalLongStr,
  metaKeywords: optionalStr,
  ogImage: optionalUrl,
  packageIds: z.array(z.string()).default([]),
  destinationIds: z.array(z.string()).default([]),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
