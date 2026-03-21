import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Heart, Award, Target, Eye } from "lucide-react";
import { SITE_CONFIG, STATS } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsCounter } from "@/components/shared/stats-counter";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: `About Us — ${SITE_CONFIG.name}`,
  description:
    "Learn about WanderQuest Travels — our story, mission, and the passion-driven team behind India's most curated travel experiences. 8+ years of crafting unforgettable journeys.",
  openGraph: {
    title: `About WanderQuest Travels`,
    description:
      "The story behind WanderQuest — 8+ years of curating unforgettable travel experiences across India.",
    siteName: SITE_CONFIG.name,
  },
};

const WHY_FEATURES = [
  {
    icon: Shield,
    title: "Safe & Trusted",
    description:
      "Every trip is fully insured with certified guides and 24/7 emergency support. Your safety is our top priority — always.",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description:
      "Recognized as one of India's top travel companies with multiple industry awards for customer satisfaction and responsible tourism.",
  },
  {
    icon: Users,
    title: "Community of Travelers",
    description:
      "Join over 10,000 happy travelers who've explored India's wonders with us. Our community is at the heart of everything we do.",
  },
  {
    icon: Heart,
    title: "Passion for Travel",
    description:
      "We don't just sell tours — we craft experiences. Every itinerary is built with genuine love for India's culture, history, and landscapes.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85&auto=format&fit=crop"
          alt="WanderQuest Travels — About Us"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 w-full px-4 sm:px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 mb-5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Our Story
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
              About WanderQuest
            </h1>
            <p className="mt-4 text-lg text-white/75 max-w-2xl">
              Crafting unforgettable journeys across India since 2016.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Text */}
            <div className="space-y-6">
              <div>
                <div className="h-1 w-12 rounded-full bg-primary mb-4" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                  A Journey That Started <br className="hidden sm:block" /> With a Dream
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  WanderQuest Travels was born in 2016 from a simple yet powerful idea:
                  India is one of the most extraordinary travel destinations in the world,
                  yet most visitors only scratch its surface. We set out to change that.
                </p>
                <p>
                  Our founders — a group of passionate travel enthusiasts who had collectively
                  explored every nook of the subcontinent — began by handcrafting intimate
                  tour packages for friends and family. Word spread fast. Within two years,
                  WanderQuest was serving travelers from across India and beyond.
                </p>
                <p>
                  Today, with a team of 50+ travel experts, certified guides, and a network
                  of trusted partners across 50+ destinations, we remain deeply committed to
                  our founding promise: <em>authentic, safe, and deeply memorable travel experiences.</em>
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-primary">2016</span>
                  <span className="text-xs text-muted-foreground">Founded</span>
                </div>
                <Separator orientation="vertical" className="h-12 self-center" />
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-primary">50+</span>
                  <span className="text-xs text-muted-foreground">Team Members</span>
                </div>
                <Separator orientation="vertical" className="h-12 self-center" />
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-primary">50+</span>
                  <span className="text-xs text-muted-foreground">Destinations</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-80 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1000&q=85&auto=format&fit=crop"
                alt="WanderQuest team on a mountain expedition"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 [&_h2]:text-primary-foreground [&_.h-1]:bg-primary-foreground/60 [&_p]:text-primary-foreground/75">
            <SectionHeading
              title="Our Impact in Numbers"
              subtitle="Every number represents a traveler who trusted us with their adventure"
              align="center"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <StatsCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                className="[&_.text-4xl]:text-primary-foreground [&_.text-5xl]:text-primary-foreground [&_p]:text-primary-foreground/70 [&_.text-primary]:text-primary-foreground"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <SectionHeading
              title="Our Purpose"
              subtitle="The values that guide every trip we plan and every traveler we serve"
              align="center"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 blur-2xl -translate-y-1/4 translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/15 mb-5">
                  <Target className="size-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To make the magic of India accessible to every traveler — by designing
                  thoughtful, safe, and culturally rich experiences that go beyond sightseeing.
                  We believe travel should transform you, challenge you, and connect you with
                  something larger than yourself.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We are committed to responsible tourism — partnering with local communities,
                  minimizing environmental impact, and ensuring that every journey enriches
                  both the traveler and the destination.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-500/5 blur-2xl -translate-y-1/4 translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex items-center justify-center size-14 rounded-2xl bg-amber-500/15 mb-5">
                  <Eye className="size-7 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become India&apos;s most trusted travel companion — a company where every
                  traveler feels seen, heard, and cared for from the moment they start planning
                  to the moment they arrive home with stories they&apos;ll tell for generations.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We envision a world where authentic travel bridges cultures, fosters empathy,
                  and creates lasting bonds between people and the extraordinary places they visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <SectionHeading
              title="Why Travelers Choose Us"
              subtitle="Four reasons why 10,000+ travelers return to WanderQuest again and again"
              align="center"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center size-13 rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <Icon className="size-6 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Image CTA */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80&auto=format&fit=crop"
          alt="Travel adventure with WanderQuest"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Start Your Journey
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Your Next Adventure <br className="hidden sm:block" /> Awaits
          </h2>
          <p className="text-lg text-white/75 max-w-xl mx-auto mb-8">
            Whether you&apos;re dreaming of snowy peaks, golden deserts, or tropical shores —
            we&apos;ll craft the perfect trip for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Packages
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-white/40 bg-white/10 text-white font-semibold text-base backdrop-blur-sm hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
