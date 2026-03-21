"use server";

import { db } from "@/lib/db";
import { generateReferenceNo, formatDate } from "@/lib/utils";
import { bookingSchema } from "@/lib/validations/booking";
import {
  sendBookingConfirmation,
  sendBookingAlertToAdmin,
} from "@/lib/email";

type BookingActionResult =
  | { success: true; referenceNo: string }
  | { error: string; fieldErrors?: Record<string, string[]> };

export async function createBooking(
  data: Record<string, unknown>
): Promise<BookingActionResult> {
  const parsed = bookingSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid form data",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { packageId, name, email, phone, travelers, date, notes } = parsed.data;

  try {
    // Verify package exists
    const pkg = await db.package.findUnique({
      where: { id: packageId },
      select: { id: true, title: true },
    });

    if (!pkg) {
      return { error: "Package not found. It may have been removed." };
    }

    // Generate sequential reference number
    const lastBooking = await db.booking.findFirst({
      orderBy: { createdAt: "desc" },
      select: { referenceNo: true },
    });

    const referenceNo = await generateReferenceNo("WQ", lastBooking?.referenceNo);

    // Create booking record
    await db.booking.create({
      data: {
        referenceNo,
        packageId,
        name,
        email,
        phone,
        travelers,
        date,
        notes,
      },
    });

    // Send emails non-blocking
    const emailData = {
      referenceNo,
      customerName: name,
      customerEmail: email,
      packageTitle: pkg.title,
      travelDate: formatDate(date),
      travelers,
    };

    sendBookingConfirmation(emailData).catch(console.error);
    sendBookingAlertToAdmin(emailData).catch(console.error);

    return { success: true, referenceNo };
  } catch (error) {
    console.error("createBooking error:", error);
    return { error: "Failed to create booking. Please try again." };
  }
}
