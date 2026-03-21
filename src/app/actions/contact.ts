"use server";

import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";
import { sendInquiryAlert } from "@/lib/email";

type ContactActionResult =
  | { success: true }
  | { error: string; fieldErrors?: Record<string, string[]> };

export async function createContactInquiry(
  data: Record<string, unknown>
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid form data",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, phone, message } = parsed.data;

  try {
    // Create inquiry record
    await db.inquiry.create({
      data: { name, email, phone, message },
    });

    // Send admin alert non-blocking
    sendInquiryAlert({ name, email, phone, message }).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("createContactInquiry error:", error);
    return { error: "Failed to submit your inquiry. Please try again." };
  }
}
