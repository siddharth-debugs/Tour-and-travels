"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { destinationSchema } from "@/lib/validations/destination";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function createDestination(data: unknown) {
  await requireAuth();

  const parsed = destinationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, description, region, image, featured } = parsed.data;
  const slug = slugify(name);

  const existing = await db.destination.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.destination.create({
    data: { name, slug: finalSlug, description, region, image, featured },
  });

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { success: true };
}

export async function updateDestination(id: string, data: unknown) {
  await requireAuth();

  const parsed = destinationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, description, region, image, featured } = parsed.data;
  const slug = slugify(name);

  const existing = await db.destination.findFirst({
    where: { slug, NOT: { id } },
  });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.destination.update({
    where: { id },
    data: { name, slug: finalSlug, description, region, image, featured },
  });

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { success: true };
}

export async function deleteDestination(id: string) {
  await requireAuth();

  await db.destination.delete({ where: { id } });

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { success: true };
}
