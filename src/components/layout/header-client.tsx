"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { NavCollection } from "./header";

interface Props {
  packageCollections: NavCollection[];
  destinationCollections: NavCollection[];
}

interface NavLink {
  label: string;
  href: string;
  collections?: NavCollection[];
  collectionBaseHref?: string;
}

export function HeaderClient({
  packageCollections,
  destinationCollections,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { label: "Home", href: "/" },
    {
      label: "Destinations",
      href: "/destinations",
      collections: destinationCollections,
      collectionBaseHref: "/destinations/c",
    },
    {
      label: "Packages",
      href: "/packages",
      collections: packageCollections,
      collectionBaseHref: "/packages/c",
    },
    { label: "Cab Services", href: "/cabs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300",
        scrolled && "shadow-md border-border/80 bg-background/95"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl group"
        >
          <div className="flex items-center justify-center rounded-lg bg-primary p-1.5 transition-transform group-hover:scale-105">
            <Mountain className="size-5 text-primary-foreground" />
          </div>
          <span className="text-foreground tracking-tight">
            Wander<span className="text-primary">Quest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <DesktopNavItem
              key={link.href}
              link={link}
              active={pathname === link.href}
            />
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/packages" />}
            size="sm"
            className="font-semibold px-5"
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2 font-bold text-lg">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
                      <Mountain className="size-4 text-primary-foreground" />
                    </div>
                    <span>
                      Wander<span className="text-primary">Quest</span>
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-3 py-4 gap-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <MobileNavItem
                    key={link.href}
                    link={link}
                    pathname={pathname}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
                <div className="mt-4 px-1">
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        href="/packages"
                        onClick={() => setMobileOpen(false)}
                      />
                    }
                    className="w-full font-semibold"
                  >
                    Book Now
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function DesktopNavItem({
  link,
  active,
}: {
  link: NavLink;
  active: boolean;
}) {
  const hasCollections = link.collections && link.collections.length > 0;
  const [open, setOpen] = useState(false);

  if (!hasCollections) {
    return (
      <Link
        href={link.href}
        className={cn(
          "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {link.label}
        {active && (
          <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary" />
        )}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={link.href}
        className={cn(
          "relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {link.label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
        {active && (
          <span className="absolute bottom-0.5 left-3 right-7 h-0.5 rounded-full bg-primary" />
        )}
      </Link>
      <div
        className={cn(
          "absolute left-0 top-full pt-2 transition-all",
          open
            ? "opacity-100 visible translate-y-0"
            : "invisible opacity-0 -translate-y-1 pointer-events-none"
        )}
      >
        <div className="w-72 rounded-lg border border-border bg-popover p-2 shadow-lg ring-1 ring-foreground/5">
          <Link
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            All {link.label}
            <span className="ml-1 text-xs text-muted-foreground">
              · Browse everything
            </span>
          </Link>
          <div className="my-1 h-px bg-border/60" />
          <div className="grid gap-0.5">
            {link.collections!.map((c) => (
              <Link
                key={c.slug}
                href={`${link.collectionBaseHref}/${c.slug}`}
                className="block rounded-md px-3 py-2 hover:bg-muted"
              >
                <div className="text-sm font-medium text-foreground">
                  {c.name}
                </div>
                {c.tagline && (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {c.tagline}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({
  link,
  pathname,
  onClose,
}: {
  link: NavLink;
  pathname: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(pathname.startsWith(link.href));
  const hasCollections = link.collections && link.collections.length > 0;
  const active = pathname === link.href;

  if (!hasCollections) {
    return (
      <Link
        href={link.href}
        onClick={onClose}
        className={cn(
          "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted hover:text-primary"
        )}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={link.href}
          onClick={onClose}
          className={cn(
            "flex flex-1 items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            active
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-muted hover:text-primary"
          )}
        >
          {link.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          aria-label={`Toggle ${link.label} submenu`}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </div>
      {open && (
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
          {link.collections!.map((c) => (
            <Link
              key={c.slug}
              href={`${link.collectionBaseHref}/${c.slug}`}
              onClick={onClose}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
