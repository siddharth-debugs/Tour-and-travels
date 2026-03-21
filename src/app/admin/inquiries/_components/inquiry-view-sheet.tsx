"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface Props {
  inquiry: Inquiry;
}

export function InquiryViewSheet({ inquiry }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
        <Eye className="size-4" />
        <span className="sr-only">View inquiry</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inquiry from {inquiry.name}</SheetTitle>
          <SheetDescription>
            Received on{" "}
            {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4 px-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contact
            </p>
            <p className="mt-1 text-sm font-medium">{inquiry.email}</p>
            {inquiry.phone && (
              <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Message
            </p>
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
              {inquiry.message}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
