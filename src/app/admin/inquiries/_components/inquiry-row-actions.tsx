"use client";

import { useState, useTransition } from "react";
import { Trash2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { markInquiryAsRead, deleteInquiry } from "@/app/actions/admin/inquiries";
import { toast } from "sonner";

interface Props {
  id: string;
  isRead: boolean;
}

export function InquiryRowActions({ id, isRead }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleMarkRead() {
    startTransition(async () => {
      await markInquiryAsRead(id);
      toast.success("Marked as read");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteInquiry(id);
      toast.success("Inquiry deleted");
      setDeleteOpen(false);
    });
  }

  return (
    <div className="flex items-center gap-1">
      {!isRead && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:text-blue-700"
          onClick={handleMarkRead}
          disabled={isPending}
          title="Mark as read"
        >
          <MailCheck className="size-4" />
          <span className="sr-only">Mark as read</span>
        </Button>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Delete inquiry"
            />
          }
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inquiry? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
