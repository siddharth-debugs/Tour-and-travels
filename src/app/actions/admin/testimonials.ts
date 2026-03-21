"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { testimonialSchema } from "@/lib/validations/testimonial";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function createTestimonial(data: unknown) {
  await requireAuth();

  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { avatar, ...rest } = parsed.data;

  await db.testimonial.create({
    data: {
      ...rest,
      avatar: avatar || null,
    },
  });

  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function updateTestimonial(id: string, data: unknown) {
  await requireAuth();

  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { avatar, ...rest } = parsed.data;

  await db.testimonial.update({
    where: { id },
    data: {
      ...rest,
      avatar: avatar || null,
    },
  });

  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAuth();

  await db.testimonial.delete({ where: { id } });

  revalidatePath("/admin/testimonials");
  return { success: true };
}
