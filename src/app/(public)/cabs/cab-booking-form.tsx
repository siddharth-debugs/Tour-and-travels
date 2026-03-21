"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCabBooking } from "@/app/actions/cab-booking";

interface CabType {
  id: string;
  name: string;
  capacity: number;
  pricePerKm: number;
}

interface CabBookingFormProps {
  cabTypes: CabType[];
}

export function CabBookingForm({ cabTypes }: CabBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    cabTypeId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.phone || !form.pickup || !form.drop || !form.date || !form.time || !form.cabTypeId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      const result = await createCabBooking({
        ...form,
        date: new Date(form.date),
      });

      if ("success" in result && result.success) {
        setReferenceNo(result.referenceNo);
        setSubmitted(true);
        toast.success("Cab booking request sent!", {
          description: "We'll confirm your booking within 2 hours.",
        });
      } else if ("error" in result) {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Booking Request Sent!</h3>
        {referenceNo && (
          <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-0.5">Your booking reference</p>
            <span className="text-base font-mono font-semibold text-primary">
              {referenceNo}
            </span>
          </div>
        )}
        <p className="text-muted-foreground max-w-sm">
          Thank you! Our team will confirm your cab booking within 2 hours. We&apos;ll reach out on{" "}
          <span className="font-medium text-foreground">{form.email}</span>.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setReferenceNo(null);
            setForm({ name: "", email: "", phone: "", pickup: "", drop: "", date: "", time: "", cabTypeId: "" });
          }}
        >
          Book Another Cab
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Cab Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.cabTypeId}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, cabTypeId: val ?? "" }))
            }
          >
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue placeholder="Select cab type" />
            </SelectTrigger>
            <SelectContent>
              {cabTypes.map((cab) => (
                <SelectItem key={cab.id} value={cab.id}>
                  {cab.name} (up to {cab.capacity} pax)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pickup" className="text-sm font-medium">
            Pickup Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pickup"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            placeholder="Enter pickup address"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="drop" className="text-sm font-medium">
            Drop Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="drop"
            name="drop"
            value={form.drop}
            onChange={handleChange}
            placeholder="Enter drop address"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-sm font-medium">
            Travel Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="time" className="text-sm font-medium">
            Pickup Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>
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
            Sending Request…
          </>
        ) : (
          "Request Cab Booking"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Our team will confirm your booking within 2 hours of your request.
      </p>
    </form>
  );
}
