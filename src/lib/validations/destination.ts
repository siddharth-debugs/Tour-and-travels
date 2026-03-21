import { z } from "zod";
import { REGIONS } from "@/lib/constants";

export const destinationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  region: z.enum(REGIONS as unknown as [string, ...string[]], { message: "Select a valid region" }),
  image: z.string().url("Valid image URL required"),
  featured: z.boolean().default(false),
});

export type DestinationFormData = z.infer<typeof destinationSchema>;
