"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { packageFormSchema } from "@/lib/validations/package-form";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function createPackage(data: unknown) {
  await requireAuth();

  const parsed = packageFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { title, destinationId, price, duration, groupSize, category, itinerary, inclusions, exclusions, images, featured } = parsed.data;
  const slug = slugify(title);

  const existing = await db.package.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.package.create({
    data: {
      title,
      slug: finalSlug,
      destinationId,
      price,
      duration,
      groupSize,
      category,
      itinerary,
      inclusions,
      exclusions,
      images,
      featured,
    },
  });

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  return { success: true };
}

export async function updatePackage(id: string, data: unknown) {
  await requireAuth();

  const parsed = packageFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { title, destinationId, price, duration, groupSize, category, itinerary, inclusions, exclusions, images, featured } = parsed.data;
  const slug = slugify(title);

  const existing = await db.package.findFirst({
    where: { slug, NOT: { id } },
  });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.package.update({
    where: { id },
    data: {
      title,
      slug: finalSlug,
      destinationId,
      price,
      duration,
      groupSize,
      category,
      itinerary,
      inclusions,
      exclusions,
      images,
      featured,
    },
  });

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  return { success: true };
}

export async function deletePackage(id: string) {
  await requireAuth();

  await db.package.delete({ where: { id } });

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  return { success: true };
}
