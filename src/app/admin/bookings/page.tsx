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
import { BookingActions } from "./_components/booking-actions";
import { StatusFilter } from "./_components/status-filter";
import { Pagination } from "./_components/pagination";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  page?: string;
}

const VALID_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default async function AdminBookingsPage({
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

  const [bookings, totalCount] = await Promise.all([
    db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { package: { select: { title: true } } },
    }),
    db.booking.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage tour package bookings ({totalCount} total)
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-base font-semibold">All Bookings</CardTitle>
          <StatusFilter currentStatus={params.status ?? "ALL"} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Reference</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Package</TableHead>
                  <TableHead className="font-semibold">Travel Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="w-12 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
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
                      <TableCell className="max-w-[200px]">
                        <span className="line-clamp-1 text-sm">
                          {booking.package.title}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <BookingActions
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
