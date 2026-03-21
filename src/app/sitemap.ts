import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wanderquest.com";
  const destinations = await db.destination.findMany({ select: { slug: true, updatedAt: true } });
  const packages = await db.package.findMany({ select: { slug: true, updatedAt: true } });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/cabs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...destinations.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...packages.map((p) => ({
      url: `${baseUrl}/packages/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
