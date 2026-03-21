import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PackageDeleteButton } from "./_components/package-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await db.package.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      destination: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
          <p className="text-sm text-muted-foreground">
            Manage tour packages ({packages.length} total)
          </p>
        </div>
        <Button render={<Link href="/admin/packages/new" />}>
          <PlusCircle className="mr-2 size-4" />
          Add Package
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All Packages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Destination</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Featured</TableHead>
                  <TableHead className="w-24 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No packages yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="max-w-[200px] font-medium">
                          <span className="line-clamp-1">{pkg.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {pkg.destination.name}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatPrice(pkg.price)}
                      </TableCell>
                      <TableCell className="text-sm">{pkg.duration}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {pkg.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pkg.featured ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            render={<Link href={`/admin/packages/${pkg.id}/edit`} />}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <PackageDeleteButton
                            id={pkg.id}
                            title={pkg.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
