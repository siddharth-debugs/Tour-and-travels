import { z } from "zod";

export const cabBookingSchema = z.object({
  cabTypeId: z.string().min(1, "Cab type is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number"),
  pickup: z.string().min(2, "Pickup location is required"),
  drop: z.string().min(2, "Drop location is required"),
  date: z.coerce.date().refine((date) => date > new Date(), {
    message: "Date must be in the future",
  }),
  time: z.string().min(1, "Time is required"),
});

export type CabBookingFormData = z.infer<typeof cabBookingSchema>;
