import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
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
import { DestinationDeleteButton } from "./_components/destination-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await db.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { packages: true } },
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
          <p className="text-sm text-muted-foreground">
            Manage travel destinations ({destinations.length} total)
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/destinations/new" />}>
          <PlusCircle className="mr-2 size-4" />
          Add Destination
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All Destinations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Region</TableHead>
                  <TableHead className="font-semibold">Packages</TableHead>
                  <TableHead className="font-semibold">Featured</TableHead>
                  <TableHead className="w-24 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No destinations yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  destinations.map((dest) => (
                    <TableRow key={dest.id}>
                      <TableCell>
                        <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{dest.name}</div>
                        <div className="text-xs text-muted-foreground">
                          /{dest.slug}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{dest.region}</TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="secondary">
                          {dest._count.packages} packages
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dest.featured ? (
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
                            nativeButton={false}
                            render={<Link href={`/admin/destinations/${dest.id}/edit`} />}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <DestinationDeleteButton
                            id={dest.id}
                            name={dest.name}
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
