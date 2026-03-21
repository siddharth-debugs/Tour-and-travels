import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  CheckCircle2,
  Car,
  MessageSquare,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [
    totalBookings,
    thisMonthBookings,
    pendingBookings,
    confirmedBookings,
    totalCabBookings,
    unreadInquiries,
    recentBookings,
    recentInquiries,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({
      where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
    }),
    db.booking.count({ where: { status: "PENDING" } }),
    db.booking.count({ where: { status: "CONFIRMED" } }),
    db.cabBooking.count(),
    db.inquiry.count({ where: { read: false } }),
    db.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { package: { select: { title: true } } },
    }),
    db.inquiry.findMany({
      take: 5,
      where: { read: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    totalBookings,
    thisMonthBookings,
    pendingBookings,
    confirmedBookings,
    totalCabBookings,
    unreadInquiries,
    recentBookings,
    recentInquiries,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const statCards = [
    {
      label: "Total Bookings",
      value: data.totalBookings,
      icon: CalendarCheck,
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "This Month",
      value: data.thisMonthBookings,
      icon: CalendarDays,
      accent: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending",
      value: data.pendingBookings,
      icon: Clock,
      accent: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Confirmed",
      value: data.confirmedBookings,
      icon: CheckCircle2,
      accent: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your travel business
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, accent, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg p-2.5 ${bg}`}>
                <Icon className={`size-5 ${accent}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-orange-50 p-2.5">
              <Car className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cab Bookings</p>
              <p className="text-2xl font-bold">{data.totalCabBookings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-red-50 p-2.5">
              <MessageSquare className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread Inquiries</p>
              <p className="text-2xl font-bold">{data.unreadInquiries}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Reference</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Package</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentBookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-20 text-center text-muted-foreground"
                    >
                      No bookings yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentBookings.map((booking) => (
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
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {booking.package.title}
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Unread Inquiries</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {data.recentInquiries.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No unread inquiries.
            </p>
          ) : (
            data.recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </time>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {inquiry.message}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
