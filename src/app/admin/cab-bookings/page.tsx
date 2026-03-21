import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CabBookingActions } from "./_components/cab-booking-actions";
import { StatusFilter } from "./_components/status-filter";
import { Pagination } from "./_components/pagination";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  page?: string;
}

const VALID_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default async function AdminCabBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusParam = params.status as BookingStatus | undefined;
  const currentStatus =
    statusParam && VALID_STATUSES.includes(statusParam) ? statusParam : undefined;

  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const pageSize = ITEMS_PER_PAGE.admin;
  const skip = (page - 1) * pageSize;

  const where = currentStatus ? { status: currentStatus } : {};

  const [cabBookings, totalCount] = await Promise.all([
    db.cabBooking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { cabType: { select: { name: true } } },
    }),
    db.cabBooking.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cab Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage cab service bookings ({totalCount} total)
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-base font-semibold">All Cab Bookings</CardTitle>
          <StatusFilter currentStatus={params.status ?? "ALL"} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Reference</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Cab Type</TableHead>
                  <TableHead className="font-semibold">Route</TableHead>
                  <TableHead className="font-semibold">Date / Time</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="w-12 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabBookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No cab bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  cabBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">
                        {booking.referenceNo}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {booking.cabType.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="max-w-[100px] truncate">
                            {booking.pickup}
                          </span>
                          <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                          <span className="max-w-[100px] truncate">
                            {booking.drop}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>
                          {new Date(booking.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs">{booking.time}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <CabBookingActions
                          bookingId={booking.id}
                          currentStatus={booking.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-border p-4">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
