"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  MapPin,
  Package,
  Truck,
  MessageSquare,
  Star,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Cab Bookings", href: "/admin/cab-bookings", icon: Car },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin },
  { label: "Packages", href: "/admin/packages", icon: Package },
  { label: "Cab Types", href: "/admin/cabs", icon: Truck },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-border px-6 py-5">
        <span className="text-lg font-bold tracking-tight text-foreground">
          WanderQuest <span className="text-orange-500">Admin</span>
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-border p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-border lg:bg-background">
        <SidebarContent />
      </aside>
    </>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <span className="text-sm font-semibold">
        WanderQuest <span className="text-orange-500">Admin</span>
      </span>
    </div>
  );
}
