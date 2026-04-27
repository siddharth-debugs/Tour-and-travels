import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil, Layers, EyeOff, Eye } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { CollectionDeleteButton } from "./_components/collection-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await db.collection.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { packages: true, destinations: true } },
    },
  });

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Collections"
        description="Curate your own groupings of packages or destinations and surface them in the navbar."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Collections" },
        ]}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/admin/collections/new" />}
          >
            <PlusCircle className="mr-2 size-4" />
            New Collection
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">In Navbar</TableHead>
                  <TableHead className="font-semibold">Featured</TableHead>
                  <TableHead className="font-semibold">Order</TableHead>
                  <TableHead className="w-24 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40">
                      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                          <Layers className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            No collections yet
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Group your tours into themes like &ldquo;Honeymoon
                            Specials&rdquo; or &ldquo;Hill Stations&rdquo;.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          nativeButton={false}
                          render={<Link href="/admin/collections/new" />}
                        >
                          <PlusCircle className="mr-2 size-4" />
                          Create your first collection
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((c) => {
                    const itemCount =
                      c.type === "PACKAGE"
                        ? c._count.packages
                        : c._count.destinations;
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{c.name}</span>
                            <span className="text-xs text-muted-foreground">
                              /{c.slug}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {c.type.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {itemCount}{" "}
                          <span className="text-muted-foreground">
                            {c.type === "PACKAGE"
                              ? itemCount === 1
                                ? "package"
                                : "packages"
                              : itemCount === 1
                              ? "destination"
                              : "destinations"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {c.showInNav ? (
                            <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                              <Eye className="size-3" /> Visible
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <EyeOff className="size-3" /> Hidden
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {c.featured ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">
                          {c.order}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              nativeButton={false}
                              render={
                                <Link href={`/admin/collections/${c.id}/edit`} />
                              }
                            >
                              <Pencil className="size-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <CollectionDeleteButton id={c.id} name={c.name} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
