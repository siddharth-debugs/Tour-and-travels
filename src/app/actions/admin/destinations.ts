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

function paths() {
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
}

export async function createDestination(data: unknown) {
  await requireAuth();
  const parsed = destinationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;
  const slug = slugify(d.name);
  const existing = await db.destination.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.destination.create({
    data: {
      name: d.name,
      slug: finalSlug,
      description: d.description,
      region: d.region,
      image: d.image,
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

export async function updateDestination(id: string, data: unknown) {
  await requireAuth();
  const parsed = destinationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;
  const slug = slugify(d.name);
  const existing = await db.destination.findFirst({
    where: { slug, NOT: { id } },
  });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.destination.update({
    where: { id },
    data: {
      name: d.name,
      slug: finalSlug,
      description: d.description,
      region: d.region,
      image: d.image,
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

export async function deleteDestination(id: string) {
  await requireAuth();
  await db.destination.delete({ where: { id } });
  paths();
  return { success: true };
}
