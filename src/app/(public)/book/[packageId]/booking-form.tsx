"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { createBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Client-side form schema — uses Date directly (not coerced) for RHF compatibility
const formSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number"),
  travelers: z
    .number({ error: "Travelers must be a number" })
    .int()
    .min(1, "At least 1 traveler required")
    .max(50, "Maximum 50 travelers"),
  date: z.date({ error: "Travel date is required" }).refine(
    (date) => date > new Date(),
    { message: "Travel date must be in the future" }
  ),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  packageId: string;
}

export function BookingForm({ packageId }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageId,
      travelers: 1,
    },
  });

  const onSubmit = (data: FormValues) => {
    setSubmittedEmail(data.email);
    startTransition(async () => {
      const result = await createBooking(data as Record<string, unknown>);
      if ("success" in result && result.success) {
        setReferenceNo(result.referenceNo);
      } else if ("error" in result) {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  // Success state
  if (referenceNo) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="size-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Booking Received!</h2>
          <p className="text-muted-foreground max-w-sm">
            Thank you for booking with WanderQuest. Your booking reference is:
          </p>
          <div className="inline-block mt-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-lg font-mono font-semibold text-primary">
              {referenceNo}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          A confirmation email has been sent to{" "}
          <span className="font-medium text-foreground">{submittedEmail}</span>.
          Our team will confirm your booking within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Hidden packageId */}
      <input type="hidden" {...register("packageId")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Your full name"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Travelers */}
        <div className="space-y-1.5">
          <Label htmlFor="travelers" className="text-sm font-medium">
            Number of Travelers <span className="text-destructive">*</span>
          </Label>
          <Input
            id="travelers"
            type="number"
            min={1}
            max={50}
            placeholder="1"
            {...register("travelers", { valueAsNumber: true })}
            aria-invalid={!!errors.travelers}
          />
          {errors.travelers && (
            <p className="text-xs text-destructive">{errors.travelers.message}</p>
          )}
        </div>
      </div>

      {/* Travel Date */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Travel Date <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger
                className={cn(
                  "flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm text-left font-normal shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  !field.value && "text-muted-foreground",
                  errors.date && "border-destructive"
                )}
              >
                <CalendarIcon className="size-4 opacity-50 shrink-0" />
                {field.value
                  ? format(field.value, "d MMMM yyyy")
                  : "Pick a travel date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(day) => {
                    field.onChange(day);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date <= new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && (
          <p className="text-xs text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium">
          Special Requests{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Any special requirements, dietary needs, or requests…"
          className="resize-none"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full font-semibold gap-2 shadow-md shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-200"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting Booking…
          </>
        ) : (
          "Confirm Booking Request"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Free cancellation up to 7 days before departure. We'll confirm within 24 hours.
      </p>
    </form>
  );
}
