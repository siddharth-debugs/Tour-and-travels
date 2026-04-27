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

function paths() {
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
}

export async function createPackage(data: unknown) {
  await requireAuth();

  const parsed = packageFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const slug = slugify(d.title);
  const existing = await db.package.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.package.create({
    data: {
      title: d.title,
      slug: finalSlug,
      destinationId: d.destinationId,
      price: d.price,
      duration: d.duration,
      groupSize: d.groupSize,
      category: d.category,
      itinerary: d.itinerary,
      inclusions: d.inclusions,
      exclusions: d.exclusions,
      images: d.images,
      featured: d.featured,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      metaKeywords: d.metaKeywords,
      ogImage: d.ogImage,
    },
  });

  paths();
  return { success: true };
}

export async function updatePackage(id: string, data: unknown) {
  await requireAuth();

  const parsed = packageFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const slug = slugify(d.title);
  const existing = await db.package.findFirst({
    where: { slug, NOT: { id } },
  });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.package.update({
    where: { id },
    data: {
      title: d.title,
      slug: finalSlug,
      destinationId: d.destinationId,
      price: d.price,
      duration: d.duration,
      groupSize: d.groupSize,
      category: d.category,
      itinerary: d.itinerary,
      inclusions: d.inclusions,
      exclusions: d.exclusions,
      images: d.images,
      featured: d.featured,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      metaKeywords: d.metaKeywords,
      ogImage: d.ogImage,
    },
  });

  paths();
  return { success: true };
}

export async function deletePackage(id: string) {
  await requireAuth();
  await db.package.delete({ where: { id } });
  paths();
  return { success: true };
}
