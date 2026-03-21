import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Car, Users, MapPin, ChevronRight, Fuel } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CabBookingForm } from "./cab-booking-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Cab Services — ${SITE_CONFIG.name}`,
  description:
    "Book comfortable, air-conditioned cabs for airport transfers, city tours, outstation trips, and more. Professional drivers, transparent pricing — WanderQuest Cabs.",
  openGraph: {
    title: `Cab Services — ${SITE_CONFIG.name}`,
    description:
      "Reliable cab services across India. Book online with WanderQuest Travels.",
    siteName: SITE_CONFIG.name,
  },
};

export default async function CabsPage() {
  const cabTypes = await db.cabType.findMany({
    orderBy: { capacity: "asc" },
  });

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Cab Services</span>
          </div>
          <SectionHeading
            title="Our Cab Services"
            subtitle="Comfortable rides for every journey — airport pickups, city tours, outstation trips, and more. Professional drivers, clean vehicles, transparent pricing."
            align="left"
          />
        </div>
      </section>

      {/* Cab Types Grid */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          {cabTypes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cabTypes.map((cab) => (
                <div
                  key={cab.id}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={cab.image}
                      alt={cab.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1">
                        ₹{cab.pricePerKm}/km
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1">
                      <Users className="size-3 text-white" />
                      <span className="text-xs text-white font-medium">
                        {cab.capacity} seats
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {cab.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            Up to {cab.capacity} passengers
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel className="size-3.5" />
                            AC
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {cab.description}
                    </p>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting at</p>
                        <p className="text-lg font-extrabold text-primary">
                          ₹{cab.pricePerKm}
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            per km
                          </span>
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Available 24/7
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <Car className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cab services coming soon
              </h3>
              <p className="text-muted-foreground">
                Our fleet details are being updated. Please check back shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features bar */}
      <section className="py-10 px-4 sm:px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Car, label: "Clean Vehicles", desc: "Sanitized after every trip" },
              { icon: Users, label: "Expert Drivers", desc: "Licensed & verified" },
              { icon: MapPin, label: "Pan India", desc: "Service across all major cities" },
              { icon: Fuel, label: "Transparent Pricing", desc: "No hidden charges" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 p-4">
                <div className="flex items-center justify-center size-11 rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 px-4 sm:px-6 bg-background" id="book-cab">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <SectionHeading
              title="Book a Cab"
              subtitle="Fill in your details below and we'll confirm your booking within 2 hours."
              align="center"
            />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 sm:p-8">
            <CabBookingForm cabTypes={cabTypes} />
          </div>
        </div>
      </section>
    </div>
  );
}
