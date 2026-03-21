"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendStatusUpdate } from "@/lib/email";
import { BookingStatus } from "@prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus
) {
  await requireAuth();

  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
    include: { package: { select: { title: true } } },
  });

  // Send status update email for relevant status changes
  if (["CONFIRMED", "COMPLETED", "CANCELLED"].includes(newStatus)) {
    await sendStatusUpdate(
      booking.email,
      booking.name,
      booking.referenceNo,
      newStatus,
      "package"
    );
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function updateCabBookingStatus(
  bookingId: string,
  newStatus: BookingStatus
) {
  await requireAuth();

  const cabBooking = await db.cabBooking.update({
    where: { id: bookingId },
    data: { status: newStatus },
    include: { cabType: { select: { name: true } } },
  });

  // Send status update email for relevant status changes
  if (["CONFIRMED", "COMPLETED", "CANCELLED"].includes(newStatus)) {
    await sendStatusUpdate(
      cabBooking.email,
      cabBooking.name,
      cabBooking.referenceNo,
      newStatus,
      "cab"
    );
  }

  revalidatePath("/admin/cab-bookings");
  revalidatePath("/admin");
}
