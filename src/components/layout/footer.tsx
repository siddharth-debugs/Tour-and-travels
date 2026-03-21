import Link from "next/link";
import { Mountain, Instagram, Facebook, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

const POPULAR_DESTINATIONS = [
  { label: "Manali", slug: "manali" },
  { label: "Goa", slug: "goa" },
  { label: "Kerala", slug: "kerala" },
  { label: "Rajasthan", slug: "rajasthan" },
];

const SOCIAL_LINKS = [
  {
    icon: Instagram,
    href: SITE_CONFIG.social.instagram,
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: SITE_CONFIG.social.facebook,
    label: "Facebook",
  },
  {
    icon: Twitter,
    href: SITE_CONFIG.social.twitter,
    label: "Twitter / X",
  },
  {
    icon: Youtube,
    href: SITE_CONFIG.social.youtube,
    label: "YouTube",
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl w-fit group">
              <div className="flex items-center justify-center rounded-lg bg-primary p-1.5 transition-transform group-hover:scale-105">
                <Mountain className="size-5 text-primary-foreground" />
              </div>
              <span>
                Wander<span className="text-primary">Quest</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-background/70 max-w-xs">
              {SITE_CONFIG.tagline} — Curated tours across incredible India.
              Unforgettable journeys, expert-guided experiences.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center size-9 rounded-full bg-background/10 text-background/70 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-background/50">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Destinations */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-background/50">
              Popular Destinations
            </h3>
            <ul className="flex flex-col gap-2.5">
              {POPULAR_DESTINATIONS.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/destinations/${slug}`}
                    className="text-sm text-background/70 transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-background/50">
              Contact Info
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Phone className="size-4 text-primary mt-0.5 shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-4 text-primary mt-0.5 shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-background/70 hover:text-primary transition-colors break-all"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-background/70 leading-relaxed">
                  {SITE_CONFIG.address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/50 text-center sm:text-left">
            © 2026 WanderQuest Travels. All rights reserved.
          </p>
          <p className="text-xs text-background/40 text-center sm:text-right">
            Crafted with ❤ for wanderers across India
          </p>
        </div>
      </div>
    </footer>
  );
}
