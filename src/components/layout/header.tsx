import { db } from "@/lib/db";
import { HeaderClient } from "./header-client";

export interface NavCollection {
  name: string;
  slug: string;
  tagline: string | null;
  type: "PACKAGE" | "DESTINATION";
}

export async function Header() {
  const collections = await db.collection.findMany({
    where: { showInNav: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { name: true, slug: true, tagline: true, type: true },
  });

  return (
    <HeaderClient
      packageCollections={collections.filter((c) => c.type === "PACKAGE")}
      destinationCollections={collections.filter(
        (c) => c.type === "DESTINATION"
      )}
    />
  );
}
