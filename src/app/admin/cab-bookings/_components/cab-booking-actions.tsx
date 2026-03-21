"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle2, XCircle, Flag } from "lucide-react";
import { updateCabBookingStatus } from "@/app/actions/admin/update-booking-status";
import { BookingStatus } from "@prisma/client";
import { toast } from "sonner";

interface CabBookingActionsProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export function CabBookingActions({ bookingId, currentStatus }: CabBookingActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: BookingStatus) {
    startTransition(async () => {
      try {
        await updateCabBookingStatus(bookingId, newStatus);
        toast.success(`Cab booking marked as ${newStatus.toLowerCase()}`);
      } catch {
        toast.error("Failed to update status");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        aria-label="Actions"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currentStatus !== "CONFIRMED" && (
          <DropdownMenuItem
            onClick={() => handleStatusChange("CONFIRMED")}
            disabled={isPending}
          >
            <CheckCircle2 className="text-blue-500" />
            Confirm
          </DropdownMenuItem>
        )}
        {currentStatus !== "COMPLETED" && (
          <DropdownMenuItem
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={isPending}
          >
            <Flag className="text-green-500" />
            Mark Completed
          </DropdownMenuItem>
        )}
        {currentStatus !== "CANCELLED" && (
          <DropdownMenuItem
            onClick={() => handleStatusChange("CANCELLED")}
            disabled={isPending}
            variant="destructive"
          >
            <XCircle />
            Cancel
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
