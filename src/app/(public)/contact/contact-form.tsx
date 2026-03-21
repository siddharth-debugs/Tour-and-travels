"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createContactInquiry } from "@/app/actions/contact";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const result = await createContactInquiry(form);

      if ("success" in result && result.success) {
        setSubmitted(true);
        toast.success("Message sent successfully!", {
          description: "We'll get back to you within 24 hours.",
        });
      } else if ("error" in result) {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm">
          Thank you for reaching out, {form.name}! We'll get back to you at{" "}
          <span className="font-medium text-foreground">{form.email}</span> within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", message: "" });
          }}
        >
          Send Another Message
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
            placeholder="Your name"
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
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number{" "}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your travel plans, questions, or anything else…"
          rows={5}
          required
          className="resize-none"
        />
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
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
