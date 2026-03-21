import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CabsManager } from "./_components/cabs-manager";

export const dynamic = "force-dynamic";

export default async function AdminCabsPage() {
  const cabTypes = await db.cabType.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cab Types</h1>
          <p className="text-sm text-muted-foreground">
            Manage cab types ({cabTypes.length} total)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">All Cab Types</CardTitle>
          <CabsManager cabTypes={cabTypes} mode="add-button" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Capacity</TableHead>
                  <TableHead className="font-semibold">Price / km</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="w-24 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabTypes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No cab types yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  cabTypes.map((cab) => (
                    <TableRow key={cab.id}>
                      <TableCell className="font-medium">{cab.name}</TableCell>
                      <TableCell className="text-sm">{cab.capacity} seats</TableCell>
                      <TableCell className="text-sm">
                        ₹{cab.pricePerKm.toFixed(2)}/km
                      </TableCell>
                      <TableCell className="max-w-[250px] text-sm text-muted-foreground">
                        <span className="line-clamp-1">{cab.description}</span>
                      </TableCell>
                      <TableCell>
                        <CabsManager cabTypes={cabTypes} mode="row-actions" cabId={cab.id} />
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
