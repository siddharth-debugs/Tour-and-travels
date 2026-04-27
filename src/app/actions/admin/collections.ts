"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { collectionSchema } from "@/lib/validations/collection";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

function paths() {
  revalidatePath("/admin/collections");
  revalidatePath("/packages");
  revalidatePath("/destinations");
  revalidatePath("/", "layout");
}

export async function createCollection(data: unknown) {
  await requireAuth();
  const parsed = collectionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;
  const baseSlug = slugify(d.name);
  const exists = await db.collection.findUnique({ where: { slug: baseSlug } });
  const slug = exists ? `${baseSlug}-${Date.now()}` : baseSlug;

  const created = await db.collection.create({
    data: {
      type: d.type,
      name: d.name,
      slug,
      tagline: d.tagline,
      description: d.description,
      content: d.content,
      image: d.image,
      showInNav: d.showInNav,
      featured: d.featured,
      order: d.order,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      metaKeywords: d.metaKeywords,
      ogImage: d.ogImage,
      packages:
        d.type === "PACKAGE" && d.packageIds.length
          ? { connect: d.packageIds.map((id) => ({ id })) }
          : undefined,
      destinations:
        d.type === "DESTINATION" && d.destinationIds.length
          ? { connect: d.destinationIds.map((id) => ({ id })) }
          : undefined,
    },
  });
  paths();
  return { success: true, id: created.id };
}

export async function updateCollection(id: string, data: unknown) {
  await requireAuth();
  const parsed = collectionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;
  const baseSlug = slugify(d.name);
  const conflict = await db.collection.findFirst({
    where: { slug: baseSlug, NOT: { id } },
  });
  const slug = conflict ? `${baseSlug}-${Date.now()}` : baseSlug;

  await db.collection.update({
    where: { id },
    data: {
      type: d.type,
      name: d.name,
      slug,
      tagline: d.tagline,
      description: d.description,
      content: d.content,
      image: d.image,
      showInNav: d.showInNav,
      featured: d.featured,
      order: d.order,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      metaKeywords: d.metaKeywords,
      ogImage: d.ogImage,
      packages:
        d.type === "PACKAGE"
          ? { set: d.packageIds.map((pid) => ({ id: pid })) }
          : { set: [] },
      destinations:
        d.type === "DESTINATION"
          ? { set: d.destinationIds.map((did) => ({ id: did })) }
          : { set: [] },
    },
  });
  paths();
  return { success: true };
}

export async function deleteCollection(id: string) {
  await requireAuth();
  await db.collection.delete({ where: { id } });
  paths();
  return { success: true };
}
