"use server";

import { db } from "@/lib/db";
import { generateReferenceNo, formatDate } from "@/lib/utils";
import { cabBookingSchema } from "@/lib/validations/cab-booking";
import {
  sendCabBookingConfirmation,
  sendCabBookingAlertToAdmin,
} from "@/lib/email";

type CabBookingActionResult =
  | { success: true; referenceNo: string }
  | { error: string; fieldErrors?: Record<string, string[]> };

export async function createCabBooking(
  data: Record<string, unknown>
): Promise<CabBookingActionResult> {
  const parsed = cabBookingSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid form data",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { cabTypeId, name, email, phone, pickup, drop, date, time } = parsed.data;

  try {
    // Verify cab type exists
    const cabType = await db.cabType.findUnique({
      where: { id: cabTypeId },
      select: { id: true, name: true },
    });

    if (!cabType) {
      return { error: "Cab type not found." };
    }

    // Generate sequential reference number
    const lastCabBooking = await db.cabBooking.findFirst({
      orderBy: { createdAt: "desc" },
      select: { referenceNo: true },
    });

    const referenceNo = await generateReferenceNo(
      "WQ-CAB",
      lastCabBooking?.referenceNo
    );

    // Create cab booking record
    await db.cabBooking.create({
      data: {
        referenceNo,
        cabTypeId,
        name,
        email,
        phone,
        pickup,
        drop,
        date,
        time,
      },
    });

    // Send emails non-blocking
    const emailData = {
      referenceNo,
      customerName: name,
      customerEmail: email,
      cabType: cabType.name,
      pickup,
      drop,
      date: formatDate(date),
      time,
    };

    sendCabBookingConfirmation(emailData).catch(console.error);
    sendCabBookingAlertToAdmin(emailData).catch(console.error);

    return { success: true, referenceNo };
  } catch (error) {
    console.error("createCabBooking error:", error);
    return { error: "Failed to create cab booking. Please try again." };
  }
}
