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
  Layers,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { label: "Destinations", href: "/admin/destinations", icon: MapPin },
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Collections", href: "/admin/collections", icon: Layers },
      { label: "Cab Types", href: "/admin/cabs", icon: Truck },
    ],
  },
  {
    label: "Bookings",
    items: [
      { label: "Tour Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Cab Bookings", href: "/admin/cab-bookings", icon: Car },
    ],
  },
  {
    label: "Communications",
    items: [
      {
        label: "Inquiries",
        href: "/admin/inquiries",
        icon: MessageSquare,
      },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
    ],
  },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isItemActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground/80"
        )}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const hasActive = group.items.some((i) => isItemActive(pathname, i.href));
  const [open, setOpen] = useState(hasActive || group.label === "Overview");

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <span>{group.label}</span>
        <ChevronDown
          className={cn(
            "size-3 transition-transform",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5">
          {group.items.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-border px-5 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">W</span>
          </div>
          <span className="text-sm font-bold tracking-tight">
            WanderQuest{" "}
            <span className="font-medium text-muted-foreground">Admin</span>
          </span>
        </Link>
      </div>

      {/* Groups */}
      <nav className="flex-1 space-y-3 overflow-y-auto px-2.5 py-3">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} group={group} pathname={pathname} />
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-border p-2.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-background">
      <SidebarContent />
    </aside>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Toggle menu"
            >
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <span className="text-sm font-semibold">
        WanderQuest{" "}
        <span className="font-medium text-muted-foreground">Admin</span>
      </span>
    </div>
  );
}
