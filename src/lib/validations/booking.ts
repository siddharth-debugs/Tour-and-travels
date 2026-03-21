import { z } from "zod";

export const bookingSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number"),
  travelers: z
    .number()
    .int()
    .min(1, "At least 1 traveler required")
    .max(50, "Maximum 50 travelers"),
  date: z.coerce.date().refine((date) => date > new Date(), {
    message: "Travel date must be in the future",
  }),
  notes: z.string().max(1000).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
