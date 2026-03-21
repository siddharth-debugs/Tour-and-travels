import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateReferenceNo(
  prefix: string = "WQ",
  lastReferenceNo?: string | null
): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  let counter = 1;

  if (lastReferenceNo) {
    const parts = lastReferenceNo.split("-");
    const lastYearMonth = parts[1];
    if (lastYearMonth === yearMonth) {
      counter = parseInt(parts[2], 10) + 1;
    }
  }

  return `${prefix}-${yearMonth}-${String(counter).padStart(5, "0")}`;
}
// Usage in server actions: query last booking of current month to get lastReferenceNo
// const lastBooking = await db.booking.findFirst({ orderBy: { createdAt: "desc" }, select: { referenceNo: true } });
// const refNo = await generateReferenceNo("WQ", lastBooking?.referenceNo);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
