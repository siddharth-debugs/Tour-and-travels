"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function markInquiryAsRead(id: string) {
  await requireAuth();

  await db.inquiry.update({ where: { id }, data: { read: true } });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteInquiry(id: string) {
  await requireAuth();

  await db.inquiry.delete({ where: { id } });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { success: true };
}
