"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cabTypeSchema } from "@/lib/validations/cab-type";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function createCabType(data: unknown) {
  await requireAuth();

  const parsed = cabTypeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await db.cabType.create({ data: parsed.data });

  revalidatePath("/admin/cabs");
  return { success: true };
}

export async function updateCabType(id: string, data: unknown) {
  await requireAuth();

  const parsed = cabTypeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await db.cabType.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/cabs");
  return { success: true };
}

export async function deleteCabType(id: string) {
  await requireAuth();

  await db.cabType.delete({ where: { id } });

  revalidatePath("/admin/cabs");
  return { success: true };
}
