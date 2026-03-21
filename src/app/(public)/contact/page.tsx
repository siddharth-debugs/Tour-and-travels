import { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: `Contact Us — ${SITE_CONFIG.name}`,
  description: `Get in touch with WanderQuest Travels. Call us at ${SITE_CONFIG.phone}, email ${SITE_CONFIG.email}, or fill in our contact form. We're here to help plan your next adventure.`,
  openGraph: {
    title: `Contact WanderQuest Travels`,
    description: `Reach out to our travel experts. We're here to help you plan your dream trip.`,
    siteName: SITE_CONFIG.name,
  },
};

const SOCIAL_LINKS = [
  {
    icon: Instagram,
    label: "Instagram",
    href: SITE_CONFIG.social.instagram,
    color: "hover:text-pink-500",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: SITE_CONFIG.social.facebook,
    color: "hover:text-blue-600",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    href: SITE_CONFIG.social.twitter,
    color: "hover:text-sky-500",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: SITE_CONFIG.social.youtube,
    color: "hover:text-red-600",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Contact</span>
          </div>
          <SectionHeading
            title="Get in Touch"
            subtitle="Have questions about a package? Want to plan a custom trip? Our travel experts are just a message away."
            align="left"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form — Left (wider) */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10">
                    <MessageSquare className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Send a Message</h2>
                    <p className="text-sm text-muted-foreground">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info — Right */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Details */}
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6">
                <h2 className="text-lg font-bold text-foreground mb-5">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                      <Phone className="size-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        Phone
                      </p>
                      <a
                        href={`tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, "")}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {SITE_CONFIG.phone}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Mon–Sat, 9 AM – 7 PM IST
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                      <Mail className="size-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        Email
                      </p>
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors break-all"
                      >
                        {SITE_CONFIG.email}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        We reply within 24 hours
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                      <MapPin className="size-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        Office Address
                      </p>
                      <p className="text-sm font-semibold text-foreground leading-relaxed">
                        {SITE_CONFIG.address}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                      <Clock className="size-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        Office Hours
                      </p>
                      <div className="text-sm text-foreground space-y-0.5">
                        <p>Mon – Fri: 9:00 AM – 7:00 PM</p>
                        <p>Saturday: 10:00 AM – 5:00 PM</p>
                        <p className="text-muted-foreground">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6">
                <h2 className="text-base font-bold text-foreground mb-4">
                  Follow Us
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 p-3 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted ${color} hover:-translate-y-0.5`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="text-sm font-medium">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Embed */}
              <div className="rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border/50 bg-card">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    Our Location
                  </h2>
                </div>
                <div className="relative h-52">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6707523042365!2d77.21919!3d28.6328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="WanderQuest Travels Office Location — Connaught Place, New Delhi"
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 px-4 sm:px-6 bg-muted/30 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Looking for quick answers?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our most frequently asked questions about bookings, cancellations, payments, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
            >
              Browse Packages
            </Link>
            <Link
              href="/cabs"
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Book a Cab
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
