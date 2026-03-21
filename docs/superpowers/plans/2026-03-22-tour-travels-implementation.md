# WanderQuest Tour & Travels — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete tour & travels website with customer-facing pages, booking system, email notifications, and admin dashboard — all deployable on Vercel free tier.

**Architecture:** Next.js 15 App Router monolith with Server Components, Server Actions, and API routes. PostgreSQL (Neon) via Prisma ORM. Shadcn/ui + Tailwind CSS for theming. Framer Motion for animations. Resend for transactional email. Cloudinary for image storage.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Shadcn/ui (v4 CLI), Prisma, Neon PostgreSQL, NextAuth.js v5, Resend, Cloudinary, Framer Motion, Zod, React Hook Form

**Spec:** `docs/superpowers/specs/2026-03-22-tour-travels-website-design.md`

---

## Phase 1: Project Foundation

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, etc. (via CLI)
- Create: `src/styles/globals.css` (theme variables)
- Create: `.env.example`

- [ ] **Step 1: Create Next.js app**

```bash
cd /home/sortstring/Projects/Personal/Tour-and-travels
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

This scaffolds in the current directory with TypeScript, Tailwind, ESLint, App Router, src directory, and `@/*` import alias.

- [ ] **Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client @neondatabase/serverless @prisma/adapter-neon
npm install next-auth@beta @auth/prisma-adapter
npm install resend @react-email/components
npm install cloudinary
npm install framer-motion
npm install zod react-hook-form @hookform/resolvers
npm install slugify bcryptjs
npm install @tanstack/react-table
npm install -D @types/bcryptjs prisma
```

- [ ] **Step 3: Initialize Shadcn/ui**

```bash
npx shadcn@latest init -d
```

The `-d` flag uses defaults. This creates `components.json` and sets up the `src/components/ui` directory.

- [ ] **Step 4: Add essential Shadcn components**

```bash
npx shadcn@latest add button card input label textarea select dialog sheet table badge dropdown-menu separator avatar tabs accordion form toast sonner navigation-menu skeleton switch carousel command popover calendar
```

- [ ] **Step 5: Set up global theme variables**

Replace `src/app/globals.css` with the full theme. The key is using HSL values as CSS custom properties so changing colors propagates everywhere:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));
  --color-sidebar-background: hsl(var(--sidebar-background));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-primary: hsl(var(--sidebar-primary));
  --color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
  --color-sidebar-border: hsl(var(--sidebar-border));
  --color-sidebar-ring: hsl(var(--sidebar-ring));
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* ===== TRAVEL THEME — Change these to rebrand the entire site ===== */
:root {
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 84% 5%;
  --primary: 25 95% 53%;          /* Warm orange — main brand color */
  --primary-foreground: 0 0% 100%;
  --secondary: 199 89% 48%;       /* Ocean blue — secondary brand */
  --secondary-foreground: 0 0% 100%;
  --accent: 142 76% 36%;          /* Nature green — accent/success */
  --accent-foreground: 0 0% 100%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 25 95% 53%;
  --radius: 0.75rem;
  --chart-1: 25 95% 53%;
  --chart-2: 199 89% 48%;
  --chart-3: 142 76% 36%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 25 95% 53%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.3% 26.1%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 25 95% 53%;
}

.dark {
  --background: 222 84% 5%;
  --foreground: 210 40% 98%;
  --card: 222 84% 5%;
  --card-foreground: 210 40% 98%;
  --popover: 222 84% 5%;
  --popover-foreground: 210 40% 98%;
  --primary: 25 95% 53%;
  --primary-foreground: 0 0% 100%;
  --secondary: 199 89% 48%;
  --secondary-foreground: 0 0% 100%;
  --accent: 142 76% 36%;
  --accent-foreground: 0 0% 100%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 100%;
  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --ring: 25 95% 53%;
  --chart-1: 25 95% 63%;
  --chart-2: 199 89% 58%;
  --chart-3: 142 76% 46%;
  --chart-4: 280 65% 70%;
  --chart-5: 340 75% 65%;
  --sidebar-background: 222 84% 5%;
  --sidebar-foreground: 210 40% 98%;
  --sidebar-primary: 25 95% 53%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 217 33% 17%;
  --sidebar-accent-foreground: 210 40% 98%;
  --sidebar-border: 217 33% 17%;
  --sidebar-ring: 25 95% 53%;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 6: Create `.env.example`**

```bash
# Database (Neon)
DATABASE_URL="postgresql://user:pass@endpoint-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@endpoint.region.aws.neon.tech/dbname?sslmode=require"

# NextAuth
AUTH_SECRET="generate-with-npx-auth-secret"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@wanderquest.com"
ADMIN_PASSWORD_HASH="$2b$10$..." # Generate: npx bcryptjs hash "yourpassword"

# Resend
RESEND_API_KEY="re_xxxxx"
ADMIN_NOTIFICATION_EMAIL="admin@wanderquest.com"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="xxxxx"
CLOUDINARY_API_SECRET="xxxxx"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Copy to `.env.local` (gitignored) for local dev.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with Shadcn/ui, Tailwind, and dependencies"
```

---

### Task 2: Prisma Schema & Database Setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init
```

- [ ] **Step 2: Write the schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Destination {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String    @db.Text
  region      String    // "North India", "South India", "East India", "West India"
  image       String
  featured    Boolean   @default(false)
  packages    Package[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Package {
  id            String      @id @default(cuid())
  title         String
  slug          String      @unique
  destination   Destination @relation(fields: [destinationId], references: [id], onDelete: Cascade)
  destinationId String
  price         Float
  duration      String
  groupSize     String
  category      String      // "adventure", "religious", "honeymoon", "family", "wildlife", "beach"
  itinerary     Json        // Array of { day: number, title: string, description: string }
  inclusions    String[]
  exclusions    String[]
  images        String[]
  featured      Boolean     @default(false)
  bookings      Booking[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model CabType {
  id          String       @id @default(cuid())
  name        String
  description String       @db.Text
  pricePerKm  Float
  image       String
  capacity    Int
  cabBookings CabBooking[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Booking {
  id          String        @id @default(cuid())
  referenceNo String        @unique
  package     Package       @relation(fields: [packageId], references: [id], onDelete: Cascade)
  packageId   String
  name        String
  email       String
  phone       String
  travelers   Int
  date        DateTime
  notes       String?       @db.Text
  status      BookingStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model CabBooking {
  id          String        @id @default(cuid())
  referenceNo String        @unique
  cabType     CabType       @relation(fields: [cabTypeId], references: [id], onDelete: Cascade)
  cabTypeId   String
  name        String
  email       String
  phone       String
  pickup      String
  drop        String
  date        DateTime
  time        String
  status      BookingStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Inquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String   @db.Text
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  location  String
  avatar    String?
  rating    Int      // 1-5
  review    String   @db.Text
  featured  Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

- [ ] **Step 3: Create Prisma client singleton**

Create `src/lib/db.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 4: Generate client and push schema (requires Neon DB)**

```bash
npx prisma generate
npx prisma db push
```

Note: Requires `DATABASE_URL` and `DIRECT_URL` in `.env.local` pointing to a Neon database. Create one at neon.tech (free tier).

- [ ] **Step 5: Commit**

```bash
git add prisma/ src/lib/db.ts
git commit -m "feat: add Prisma schema with all models and database client"
```

---

### Task 3: Seed Data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add prisma seed script)

- [ ] **Step 1: Create seed file**

Create `prisma/seed.ts` with realistic Indian travel data:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.cabBooking.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.package.deleteMany();
  await prisma.cabType.deleteMany();
  await prisma.destination.deleteMany();

  // --- Destinations ---
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: "Manali",
        slug: "manali",
        description:
          "Nestled in the Kullu Valley of Himachal Pradesh, Manali is a breathtaking hill station surrounded by snow-capped peaks, lush green forests, and the roaring Beas River. A paradise for adventure enthusiasts and honeymooners alike, it offers everything from paragliding and skiing to serene temple visits and hot spring baths.",
        region: "North India",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Goa",
        slug: "goa",
        description:
          "India's smallest state packs the biggest punch when it comes to beaches, nightlife, and Portuguese heritage. From the vibrant shores of Baga and Calangute to the tranquil beauty of Palolem, Goa offers golden sands, world-class seafood, historic churches, and a laid-back vibe that keeps travelers coming back.",
        region: "West India",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Kerala",
        slug: "kerala",
        description:
          "Known as 'God's Own Country,' Kerala is a tropical paradise of backwaters, tea plantations, and pristine beaches. Cruise through the serene backwaters of Alleppey on a houseboat, explore the misty hills of Munnar, or rejuvenate with an authentic Ayurvedic spa experience.",
        region: "South India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Rajasthan",
        slug: "rajasthan",
        description:
          "The Land of Kings welcomes you with magnificent forts, opulent palaces, vibrant bazaars, and the vast Thar Desert. From the pink city of Jaipur to the blue city of Jodhpur, and from the golden dunes of Jaisalmer to the romantic lakes of Udaipur, Rajasthan is a royal experience.",
        region: "North India",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Ladakh",
        slug: "ladakh",
        description:
          "The roof of the world, Ladakh is a high-altitude desert of dramatic landscapes, crystal-clear lakes, and ancient Buddhist monasteries. Ride through the legendary Khardung La pass, camp beside the mesmerizing Pangong Lake, and discover a culture that has thrived for centuries amid the Himalayas.",
        region: "North India",
        image: "https://images.unsplash.com/photo-1626015365107-64e5ea3abfe4?w=800",
        featured: true,
      },
    }),
    prisma.destination.create({
      data: {
        name: "Andaman Islands",
        slug: "andaman-islands",
        description:
          "A tropical archipelago in the Bay of Bengal, the Andaman Islands boast pristine white-sand beaches, turquoise waters, vibrant coral reefs, and lush rainforests. Snorkel at Havelock Island, explore the historic Cellular Jail in Port Blair, and discover some of Asia's most untouched natural beauty.",
        region: "East India",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        featured: true,
      },
    }),
  ]);

  const [manali, goa, kerala, rajasthan, ladakh, andaman] = destinations;

  // --- Packages ---
  await Promise.all([
    // Manali packages
    prisma.package.create({
      data: {
        title: "Manali Adventure Expedition",
        slug: "manali-adventure-expedition",
        destinationId: manali.id,
        price: 15999,
        duration: "5 Days / 4 Nights",
        groupSize: "2-12 People",
        category: "adventure",
        itinerary: [
          { day: 1, title: "Arrival in Manali", description: "Arrive in Manali, check into hotel. Evening walk along Mall Road and visit Hadimba Temple." },
          { day: 2, title: "Solang Valley Adventure", description: "Full day at Solang Valley — paragliding, zorbing, and rope activities. Evening bonfire at camp." },
          { day: 3, title: "Rohtang Pass Excursion", description: "Drive to Rohtang Pass (3,978m). Snow activities, stunning views of Lahaul Valley. Return by evening." },
          { day: 4, title: "River Rafting & Old Manali", description: "Morning white-water rafting on Beas River. Afternoon explore Old Manali cafes and markets." },
          { day: 5, title: "Departure", description: "Breakfast, checkout, and transfer to Bhuntar Airport or Manali Bus Stand." },
        ],
        inclusions: ["Hotel accommodation (4 nights)", "Daily breakfast & dinner", "All transfers in private vehicle", "Solang Valley activities", "River rafting", "Rohtang Pass permit"],
        exclusions: ["Airfare/train tickets", "Lunch", "Personal expenses", "Travel insurance", "Any activity not mentioned"],
        images: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
          "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Manali Honeymoon Bliss",
        slug: "manali-honeymoon-bliss",
        destinationId: manali.id,
        price: 22999,
        duration: "4 Days / 3 Nights",
        groupSize: "2 People",
        category: "honeymoon",
        itinerary: [
          { day: 1, title: "Romantic Arrival", description: "Airport/bus pickup, check into luxury resort. Candlelight dinner with mountain views." },
          { day: 2, title: "Solang & Spa", description: "Morning cable car ride at Solang Valley. Afternoon couples spa and Ayurvedic massage." },
          { day: 3, title: "Private Excursion", description: "Private car to Naggar Castle and Roerich Art Gallery. Evening riverside picnic arranged." },
          { day: 4, title: "Farewell", description: "Leisure morning, brunch at resort, transfer to departure point with photo memories." },
        ],
        inclusions: ["Luxury resort (3 nights)", "All meals included", "Private cab throughout", "Candlelight dinner", "Couples spa session", "Flower-decorated room"],
        exclusions: ["Airfare", "Personal shopping", "Adventure activities", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        ],
        featured: false,
      },
    }),
    // Goa packages
    prisma.package.create({
      data: {
        title: "Goa Beach Carnival",
        slug: "goa-beach-carnival",
        destinationId: goa.id,
        price: 12999,
        duration: "4 Days / 3 Nights",
        groupSize: "2-8 People",
        category: "beach",
        itinerary: [
          { day: 1, title: "Welcome to Goa", description: "Airport pickup, check into beachside resort. Sunset at Baga Beach with welcome drinks." },
          { day: 2, title: "North Goa Explorer", description: "Visit Fort Aguada, Anjuna Flea Market, Vagator Beach. Evening at Tito's Lane nightlife." },
          { day: 3, title: "South Goa Serenity", description: "Visit Basilica of Bom Jesus, Se Cathedral. Afternoon at Palolem Beach. Seafood dinner cruise on Mandovi River." },
          { day: 4, title: "Departure", description: "Morning water sports (parasailing, jet ski). Checkout and airport transfer." },
        ],
        inclusions: ["Resort stay (3 nights)", "Breakfast daily", "Airport transfers", "Sightseeing in AC vehicle", "Mandovi River cruise", "Water sports (1 session)"],
        exclusions: ["Flights", "Lunch & dinner (except cruise)", "Drinks", "Personal expenses"],
        images: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Goa Family Fun",
        slug: "goa-family-fun",
        destinationId: goa.id,
        price: 18999,
        duration: "5 Days / 4 Nights",
        groupSize: "4-10 People",
        category: "family",
        itinerary: [
          { day: 1, title: "Family Arrival", description: "Airport pickup, resort check-in with pool access. Kids activity zone setup." },
          { day: 2, title: "Dolphin Cruise & Beaches", description: "Morning dolphin spotting cruise. Afternoon at Calangute Beach with sandcastle building." },
          { day: 3, title: "Spice Plantation & Culture", description: "Visit a Goan spice plantation with elephant ride. Afternoon at Ancestral Goa museum." },
          { day: 4, title: "Adventure Day", description: "Dudhsagar Waterfalls jeep safari. Evening at Colva Beach." },
          { day: 5, title: "Leisure & Departure", description: "Pool time, shopping at Mapusa Market. Airport transfer." },
        ],
        inclusions: ["Family suite (4 nights)", "All meals", "All transfers", "Dolphin cruise", "Spice plantation tour", "Dudhsagar jeep safari"],
        exclusions: ["Flights", "Personal purchases", "Extra activities", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        ],
        featured: false,
      },
    }),
    // Kerala packages
    prisma.package.create({
      data: {
        title: "Kerala Backwater Bliss",
        slug: "kerala-backwater-bliss",
        destinationId: kerala.id,
        price: 19999,
        duration: "6 Days / 5 Nights",
        groupSize: "2-6 People",
        category: "honeymoon",
        itinerary: [
          { day: 1, title: "Cochin Heritage", description: "Arrive in Cochin. Visit Fort Kochi, Chinese Fishing Nets, Jewish Synagogue. Evening Kathakali dance show." },
          { day: 2, title: "Munnar Tea Gardens", description: "Drive to Munnar (4 hrs). Visit tea plantations, Eravikulam National Park. Stay in hillside resort." },
          { day: 3, title: "Munnar Exploration", description: "Mattupetty Dam, Echo Point, Kundala Lake. Tea museum visit. Evening Ayurvedic massage." },
          { day: 4, title: "Thekkady Wildlife", description: "Drive to Thekkady. Periyar Wildlife Sanctuary boat cruise. Spice garden walk." },
          { day: 5, title: "Alleppey Houseboat", description: "Drive to Alleppey. Board luxury houseboat for overnight backwater cruise. Kerala cuisine on board." },
          { day: 6, title: "Departure", description: "Disembark houseboat. Transfer to Cochin Airport." },
        ],
        inclusions: ["5 nights accommodation (hotels + houseboat)", "Breakfast & dinner daily", "AC vehicle transfers", "Houseboat with all meals", "Periyar boat cruise", "Kathakali show tickets"],
        exclusions: ["Flights", "Lunch", "Personal expenses", "Camera fees at parks", "Tips"],
        images: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Kerala Ayurveda Retreat",
        slug: "kerala-ayurveda-retreat",
        destinationId: kerala.id,
        price: 25999,
        duration: "5 Days / 4 Nights",
        groupSize: "1-4 People",
        category: "honeymoon",
        itinerary: [
          { day: 1, title: "Wellness Begins", description: "Arrive at Ayurvedic resort in Kovalam. Consultation with Ayurvedic doctor. Personalized treatment plan." },
          { day: 2, title: "Full Spa Day", description: "Morning yoga, Abhyanga massage, Shirodhara therapy. Afternoon meditation by the beach." },
          { day: 3, title: "Nature & Healing", description: "Herbal garden tour, cooking class for Ayurvedic meals. Evening temple visit." },
          { day: 4, title: "Beach & Rejuvenation", description: "Morning swim at Kovalam Beach. Final spa treatment. Sunset catamaran ride." },
          { day: 5, title: "Departure", description: "Final yoga session, take-home Ayurvedic wellness kit. Airport transfer." },
        ],
        inclusions: ["Ayurvedic resort (4 nights)", "All Ayurvedic meals", "Daily yoga sessions", "6 spa treatments", "Doctor consultation", "Wellness kit"],
        exclusions: ["Flights", "Personal shopping", "Extra treatments", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        ],
        featured: false,
      },
    }),
    // Rajasthan packages
    prisma.package.create({
      data: {
        title: "Royal Rajasthan Circuit",
        slug: "royal-rajasthan-circuit",
        destinationId: rajasthan.id,
        price: 24999,
        duration: "7 Days / 6 Nights",
        groupSize: "2-10 People",
        category: "family",
        itinerary: [
          { day: 1, title: "Jaipur - Pink City", description: "Arrive in Jaipur. Visit Amber Fort with elephant ride, Hawa Mahal. Evening light show at Amber." },
          { day: 2, title: "Jaipur Exploration", description: "City Palace, Jantar Mantar observatory, Nahargarh Fort sunset. Shopping at Johari Bazaar." },
          { day: 3, title: "Jodhpur - Blue City", description: "Drive to Jodhpur (5 hrs). Visit Mehrangarh Fort, Jaswant Thada. Evening at Clock Tower market." },
          { day: 4, title: "Jaisalmer - Golden City", description: "Drive to Jaisalmer (5 hrs). Visit Jaisalmer Fort, Patwon Ki Haveli. Evening at Sam Sand Dunes." },
          { day: 5, title: "Desert Experience", description: "Camel safari at sunrise. Visit Kuldhara ghost village. Evening desert camp with folk dance." },
          { day: 6, title: "Udaipur - City of Lakes", description: "Fly/drive to Udaipur. Visit City Palace, Lake Pichola boat ride. Dinner at lakeside restaurant." },
          { day: 7, title: "Departure", description: "Visit Saheliyon Ki Bari. Shopping. Airport transfer." },
        ],
        inclusions: ["Heritage hotel stays (6 nights)", "Breakfast & dinner", "AC vehicle & driver", "All monument entry fees", "Desert camp (1 night)", "Camel safari", "Lake Pichola boat ride"],
        exclusions: ["Flights between cities", "Lunch", "Personal shopping", "Tips", "Camera fees"],
        images: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Rajasthan Heritage Walk",
        slug: "rajasthan-heritage-walk",
        destinationId: rajasthan.id,
        price: 14999,
        duration: "4 Days / 3 Nights",
        groupSize: "2-15 People",
        category: "religious",
        itinerary: [
          { day: 1, title: "Pushkar Sacred", description: "Arrive in Pushkar. Visit Brahma Temple, Pushkar Lake aarti ceremony. Stay near the ghats." },
          { day: 2, title: "Ajmer & Pushkar", description: "Morning visit to Ajmer Sharif Dargah. Afternoon Pushkar bazaar and camel fair grounds." },
          { day: 3, title: "Jaipur Temples", description: "Drive to Jaipur. Visit Birla Mandir, Govind Dev Ji Temple, Galtaji Monkey Temple." },
          { day: 4, title: "Departure", description: "Morning meditation at temple. Checkout and transfer." },
        ],
        inclusions: ["Hotel stays (3 nights)", "Vegetarian meals", "AC vehicle", "Guide at all temples", "Pushkar Lake aarti ceremony"],
        exclusions: ["Flights/trains", "Donations at temples", "Personal expenses", "Shopping"],
        images: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        ],
        featured: false,
      },
    }),
    // Ladakh packages
    prisma.package.create({
      data: {
        title: "Ladakh Bike Expedition",
        slug: "ladakh-bike-expedition",
        destinationId: ladakh.id,
        price: 29999,
        duration: "7 Days / 6 Nights",
        groupSize: "4-12 People",
        category: "adventure",
        itinerary: [
          { day: 1, title: "Arrive in Leh", description: "Fly into Leh (3,500m). Rest day for acclimatization. Evening walk through Leh Market." },
          { day: 2, title: "Leh Sightseeing", description: "Visit Leh Palace, Shanti Stupa, Hall of Fame museum. Bike orientation and safety briefing." },
          { day: 3, title: "Khardung La Pass", description: "Ride to Khardung La (5,359m) — one of the world's highest motorable roads. Views of Karakoram Range." },
          { day: 4, title: "Nubra Valley", description: "Ride to Nubra Valley via Khardung La. Double-humped Bactrian camel ride at Hunder Sand Dunes." },
          { day: 5, title: "Pangong Lake", description: "Ride to Pangong Tso (4,350m). Overnight camping beside the iconic blue lake." },
          { day: 6, title: "Return to Leh", description: "Ride back via Chang La pass. Visit Hemis Monastery. Farewell dinner in Leh." },
          { day: 7, title: "Departure", description: "Transfer to Leh Airport. Fly out with lifetime memories." },
        ],
        inclusions: ["Royal Enfield bike rental", "Fuel & mechanic support", "Camping gear", "Guest house stays", "Breakfast & dinner", "Inner Line Permits", "Oxygen cylinders"],
        exclusions: ["Flights to/from Leh", "Lunch", "Riding gear (can be rented)", "Personal expenses", "Medical insurance (strongly recommended)"],
        images: [
          "https://images.unsplash.com/photo-1626015365107-64e5ea3abfe4?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Ladakh Monastery Trail",
        slug: "ladakh-monastery-trail",
        destinationId: ladakh.id,
        price: 21999,
        duration: "5 Days / 4 Nights",
        groupSize: "2-8 People",
        category: "religious",
        itinerary: [
          { day: 1, title: "Leh Arrival", description: "Arrive and acclimatize. Visit Shanti Stupa at sunset." },
          { day: 2, title: "Thiksey & Hemis", description: "Visit Thiksey Monastery (mini Potala Palace), Hemis Monastery. Attend morning prayers." },
          { day: 3, title: "Alchi & Lamayuru", description: "Drive to Alchi (1000-year-old murals) and Lamayuru (Moonland monastery). Meditation session." },
          { day: 4, title: "Diskit & Nubra", description: "Drive to Diskit Monastery (giant Maitreya Buddha statue). Explore Nubra Valley." },
          { day: 5, title: "Departure", description: "Morning prayers at Leh monastery. Airport transfer." },
        ],
        inclusions: ["Hotel stays (4 nights)", "All meals", "AC vehicle & driver", "Monastery entry fees", "Meditation sessions", "Inner Line Permits"],
        exclusions: ["Flights", "Personal donations", "Shopping", "Travel insurance"],
        images: [
          "https://images.unsplash.com/photo-1626015365107-64e5ea3abfe4?w=800",
        ],
        featured: false,
      },
    }),
    // Andaman packages
    prisma.package.create({
      data: {
        title: "Andaman Island Hopper",
        slug: "andaman-island-hopper",
        destinationId: andaman.id,
        price: 27999,
        duration: "6 Days / 5 Nights",
        groupSize: "2-8 People",
        category: "beach",
        itinerary: [
          { day: 1, title: "Port Blair", description: "Arrive at Veer Savarkar Airport. Visit Cellular Jail, attend Light & Sound show." },
          { day: 2, title: "Havelock Island", description: "Ferry to Havelock. Snorkeling at Elephant Beach. Relax at Radhanagar Beach (Asia's best beach)." },
          { day: 3, title: "Scuba & Beach", description: "Morning scuba diving at Nemo Reef. Afternoon kayaking through mangroves." },
          { day: 4, title: "Neil Island", description: "Ferry to Neil Island. Visit Natural Bridge, Laxmanpur Beach sunset. Seafood dinner." },
          { day: 5, title: "Ross & North Bay", description: "Return to Port Blair. Glass-bottom boat at North Bay Island. Explore Ross Island ruins." },
          { day: 6, title: "Departure", description: "Morning at Corbyn's Cove Beach. Shopping. Airport transfer." },
        ],
        inclusions: ["Resort stays (5 nights)", "Breakfast & dinner", "All ferry tickets", "Scuba diving (1 session)", "Snorkeling gear", "Glass-bottom boat", "Airport & jetty transfers"],
        exclusions: ["Flights to Port Blair", "Lunch", "Extra water sports", "Personal expenses", "Camera fees underwater"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ],
        featured: true,
      },
    }),
    prisma.package.create({
      data: {
        title: "Andaman Wildlife & Coral",
        slug: "andaman-wildlife-coral",
        destinationId: andaman.id,
        price: 19999,
        duration: "4 Days / 3 Nights",
        groupSize: "2-6 People",
        category: "wildlife",
        itinerary: [
          { day: 1, title: "Port Blair Nature", description: "Visit Samudrika Naval Marine Museum, Anthropological Museum. Evening at Cellular Jail." },
          { day: 2, title: "Baratang Island", description: "Day trip to Baratang — limestone caves and mud volcanoes through mangrove creeks." },
          { day: 3, title: "Havelock Coral", description: "Ferry to Havelock. Glass-bottom boat coral viewing. Guided marine biology walk." },
          { day: 4, title: "Departure", description: "Ferry back to Port Blair. Airport transfer." },
        ],
        inclusions: ["Hotel stays (3 nights)", "All meals", "Ferry tickets", "Baratang permits", "Glass-bottom boat", "Guided nature walks"],
        exclusions: ["Flights", "Personal expenses", "Extra activities", "Camera fees"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ],
        featured: false,
      },
    }),
  ]);

  // --- Cab Types ---
  await Promise.all([
    prisma.cabType.create({
      data: {
        name: "Sedan",
        description: "Comfortable sedan perfect for couples and small families. Ideal for city tours and short-distance travel with ample luggage space.",
        pricePerKm: 12,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
        capacity: 4,
      },
    }),
    prisma.cabType.create({
      data: {
        name: "SUV",
        description: "Spacious SUV built for mountain roads and rough terrain. Perfect for hill station trips and adventure destinations.",
        pricePerKm: 18,
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
        capacity: 6,
      },
    }),
    prisma.cabType.create({
      data: {
        name: "Toyota Innova",
        description: "India's favorite family vehicle — reliable, spacious, and comfortable for long-distance highway journeys. The gold standard for group travel.",
        pricePerKm: 16,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800",
        capacity: 7,
      },
    }),
    prisma.cabType.create({
      data: {
        name: "Tempo Traveller",
        description: "Mini-bus with push-back seats, perfect for large groups, corporate outings, and pilgrimages. AC with music system and ample luggage space.",
        pricePerKm: 25,
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
        capacity: 15,
      },
    }),
  ]);

  // --- Testimonials ---
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Priya Sharma",
        location: "New Delhi",
        rating: 5,
        review: "Our Rajasthan trip was absolutely magical! The heritage hotels were stunning, and the desert camping experience was unforgettable. The team arranged everything perfectly — from the camel safari to the folk dance evening. Will definitely book again!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Rahul Mehta",
        location: "Mumbai",
        rating: 5,
        review: "Took the Ladakh Bike Expedition and it was the adventure of a lifetime. The team ensured our safety at every point, the bike was in great condition, and the camping at Pangong Lake was surreal. Worth every penny!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Ananya & Vikram",
        location: "Bangalore",
        rating: 5,
        review: "We chose the Kerala Backwater Bliss for our honeymoon and it exceeded all expectations. The houseboat experience was incredibly romantic, and the Ayurvedic spa was heavenly. Thank you for making our special trip perfect!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Sanjay Patel",
        location: "Ahmedabad",
        rating: 4,
        review: "Family trip to Goa was well organized. Kids loved the dolphin cruise and spice plantation. The hotel was right on the beach. Only wish the trip was a day longer — there was so much more to see!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Neha Gupta",
        location: "Pune",
        rating: 5,
        review: "The Andaman trip was a dream come true. Crystal clear water, amazing snorkeling, and the scuba diving experience was beyond words. The ferry arrangements were seamless. Highly recommend!",
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Amit & Kavita Roy",
        location: "Kolkata",
        rating: 5,
        review: "We've traveled with many agencies but WanderQuest stands out. Our Manali trip was perfectly planned — from the adventure activities to the cozy hotel. The customer support was excellent throughout. 10/10!",
        featured: true,
      },
    }),
  ]);

  // --- Sample Inquiries ---
  await Promise.all([
    prisma.inquiry.create({
      data: {
        name: "Deepak Verma",
        email: "deepak@example.com",
        phone: "+91-9876543210",
        message: "Hi, I'm interested in a customized Ladakh trip for 6 people in August. Can you help with an itinerary?",
      },
    }),
    prisma.inquiry.create({
      data: {
        name: "Meera Iyer",
        email: "meera@example.com",
        message: "Do you offer corporate retreat packages for 20-30 people? Looking for something in Goa or Kerala.",
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Add seed command to package.json**

Add to `package.json`:

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

Install tsx: `npm install -D tsx`

- [ ] **Step 3: Run seed**

```bash
npx prisma db seed
```

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add seed data with 6 destinations, 12 packages, cabs, testimonials"
```

---

### Task 4: Utility Files & Constants

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/constants.ts`
- Create: `src/lib/validations/booking.ts`
- Create: `src/lib/validations/contact.ts`
- Create: `src/lib/validations/cab-booking.ts`

- [ ] **Step 1: Create utilities**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateReferenceNo(
  prefix: string = "WQ"
): Promise<string> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, "0");
  return `${prefix}-${yearMonth}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

Note: Shadcn init may have already created `src/lib/utils.ts` with just `cn()`. If so, append the other functions to it.

- [ ] **Step 2: Create constants**

Create `src/lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "WanderQuest Travels",
  tagline: "Discover Your Next Adventure",
  description:
    "Explore incredible India with WanderQuest — curated tour packages, cab services, and unforgettable travel experiences across Manali, Goa, Kerala, Rajasthan, Ladakh, and Andaman.",
  phone: "+91-98765-43210",
  email: "info@wanderquest.com",
  address: "123 Travel Street, Connaught Place, New Delhi, India - 110001",
  social: {
    instagram: "https://instagram.com/wanderquest",
    facebook: "https://facebook.com/wanderquest",
    twitter: "https://twitter.com/wanderquest",
    youtube: "https://youtube.com/@wanderquest",
  },
} as const;

export const REGIONS = [
  "North India",
  "South India",
  "East India",
  "West India",
] as const;

export const CATEGORIES = [
  { value: "adventure", label: "Adventure" },
  { value: "religious", label: "Religious & Spiritual" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "wildlife", label: "Wildlife" },
  { value: "beach", label: "Beach" },
] as const;

export const BOOKING_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
] as const;

export const STATS = [
  { label: "Happy Travelers", value: 10000, suffix: "+" },
  { label: "Tour Packages", value: 500, suffix: "+" },
  { label: "Destinations", value: 50, suffix: "+" },
  { label: "Years Experience", value: 8, suffix: "+" },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "Cab Services", href: "/cabs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ITEMS_PER_PAGE = {
  public: 12,
  admin: 20,
} as const;
```

- [ ] **Step 3: Create validation schemas**

Create `src/lib/validations/booking.ts`:

```typescript
import { z } from "zod";

export const bookingSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number"),
  travelers: z
    .number()
    .int()
    .min(1, "At least 1 traveler required")
    .max(50, "Maximum 50 travelers"),
  date: z.coerce.date().refine((date) => date > new Date(), {
    message: "Travel date must be in the future",
  }),
  notes: z.string().max(1000).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
```

Create `src/lib/validations/cab-booking.ts`:

```typescript
import { z } from "zod";

export const cabBookingSchema = z.object({
  cabTypeId: z.string().min(1, "Cab type is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number"),
  pickup: z.string().min(2, "Pickup location is required"),
  drop: z.string().min(2, "Drop location is required"),
  date: z.coerce.date().refine((date) => date > new Date(), {
    message: "Date must be in the future",
  }),
  time: z.string().min(1, "Time is required"),
});

export type CabBookingFormData = z.infer<typeof cabBookingSchema>;
```

Create `src/lib/validations/contact.ts`:

```typescript
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/
git commit -m "feat: add utilities, constants, and Zod validation schemas"
```

---

### Task 5: NextAuth Setup (Admin Auth)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/middleware.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create auth config**

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) return null;

        if (credentials.email !== adminEmail) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          adminPasswordHash
        );

        if (!isValid) return null;

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        return Response.redirect(new URL("/admin/login", nextUrl));
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
});
```

- [ ] **Step 2: Create auth API route**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Create middleware**

Create `src/middleware.ts`:

```typescript
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/ src/middleware.ts
git commit -m "feat: add NextAuth v5 admin authentication with credentials provider"
```

---

### Task 6: Email & Cloudinary Setup

**Files:**
- Create: `src/lib/email.ts`
- Create: `src/lib/cloudinary.ts`
- Create: `src/app/api/cloudinary/sign/route.ts`

- [ ] **Step 1: Create email helpers**

Create `src/lib/email.ts`:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "WanderQuest <onboarding@resend.dev>"; // Replace with custom domain later

interface BookingEmailData {
  referenceNo: string;
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  travelDate: string;
  travelers: number;
}

interface CabBookingEmailData {
  referenceNo: string;
  customerName: string;
  customerEmail: string;
  cabType: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Booking Confirmed — ${data.referenceNo} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">WanderQuest Travels</h1>
        <h2>Booking Received!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for booking with WanderQuest! Here are your booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Reference No.</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.referenceNo}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Package</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.packageTitle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Travel Date</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.travelDate}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Travelers</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.travelers}</td></tr>
        </table>
        <p>We'll confirm your booking within 24 hours. If you have any questions, reply to this email or call us at +91-98765-43210.</p>
        <p>Happy travels!<br/>Team WanderQuest</p>
      </div>
    `,
  });
}

export async function sendBookingAlertToAdmin(data: BookingEmailData) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Booking: ${data.referenceNo} — ${data.packageTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking Received</h2>
        <p><strong>Reference:</strong> ${data.referenceNo}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Package:</strong> ${data.packageTitle}</p>
        <p><strong>Date:</strong> ${data.travelDate}</p>
        <p><strong>Travelers:</strong> ${data.travelers}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">View in Dashboard →</a></p>
      </div>
    `,
  });
}

export async function sendCabBookingConfirmation(data: CabBookingEmailData) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Cab Booking Confirmed — ${data.referenceNo} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">WanderQuest Travels</h1>
        <h2>Cab Booking Received!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your cab booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Reference No.</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.referenceNo}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Cab Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.cabType}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pickup</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.pickup}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Drop</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.drop}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Date & Time</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.date} at ${data.time}</td></tr>
        </table>
        <p>We'll confirm your cab booking shortly. Contact us at +91-98765-43210 for any questions.</p>
        <p>Happy travels!<br/>Team WanderQuest</p>
      </div>
    `,
  });
}

export async function sendCabBookingAlertToAdmin(data: CabBookingEmailData) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Cab Booking: ${data.referenceNo}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Cab Booking</h2>
        <p><strong>Reference:</strong> ${data.referenceNo}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Cab:</strong> ${data.cabType}</p>
        <p><strong>Route:</strong> ${data.pickup} → ${data.drop}</p>
        <p><strong>Date:</strong> ${data.date} at ${data.time}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/cab-bookings">View in Dashboard →</a></p>
      </div>
    `,
  });
}

export async function sendStatusUpdate(
  customerEmail: string,
  customerName: string,
  referenceNo: string,
  newStatus: string,
  bookingType: "package" | "cab"
) {
  const statusMessages: Record<string, string> = {
    CONFIRMED: "Great news! Your booking has been confirmed.",
    COMPLETED: "Your trip has been marked as completed. We hope you had a wonderful experience!",
    CANCELLED: "Your booking has been cancelled. If this was a mistake, please contact us.",
  };

  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Booking ${newStatus} — ${referenceNo} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e67e22;">WanderQuest Travels</h1>
        <h2>Booking Status Update</h2>
        <p>Hi ${customerName},</p>
        <p>${statusMessages[newStatus] || `Your ${bookingType} booking status has been updated to: ${newStatus}`}</p>
        <p><strong>Reference:</strong> ${referenceNo}</p>
        <p>Questions? Contact us at +91-98765-43210 or reply to this email.</p>
        <p>Team WanderQuest</p>
      </div>
    `,
  });
}

export async function sendInquiryAlert(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Inquiry from ${data.name} | WanderQuest`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${data.message}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/inquiries">View in Dashboard →</a></p>
      </div>
    `,
  });
}
```

- [ ] **Step 2: Create Cloudinary helpers**

Create `src/lib/cloudinary.ts`:

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function generateSignature(paramsToSign: Record<string, string>) {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
}

export { cloudinary };
```

- [ ] **Step 3: Create Cloudinary sign API route**

Create `src/app/api/cloudinary/sign/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSignature } from "@/lib/cloudinary";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  const params = {
    timestamp,
    folder: "wanderquest",
  };

  const signature = generateSignature(params);

  return NextResponse.json({
    signature,
    timestamp,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/email.ts src/lib/cloudinary.ts src/app/api/cloudinary/
git commit -m "feat: add Resend email templates and Cloudinary signed upload"
```

---

## Phase 2: Customer-Facing Pages

### Task 7: Layout Components (Header, Footer, Mobile Nav)

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Modify: `src/app/(public)/layout.tsx`
- Create: `src/app/(public)/layout.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/layout/header.tsx` — responsive navbar with logo, nav links, mobile hamburger menu, and a "Book Now" CTA button. Use Shadcn `NavigationMenu` for desktop, custom mobile drawer.

Key details:
- Logo: text-based "WanderQuest" with mountain icon (use Lucide `Mountain` icon)
- Desktop: horizontal nav links from `NAV_LINKS` constant
- Mobile: hamburger icon opens `Sheet` component (Shadcn) as slide-in nav
- Sticky header with backdrop blur on scroll (detect with `useEffect` + scroll listener)
- "Book Now" button linking to `/packages`

- [ ] **Step 2: Create Footer component**

Create `src/components/layout/footer.tsx` — 4-column responsive footer:
- Column 1: Logo, tagline, social icons (Lucide icons for Instagram, Facebook, Twitter, Youtube)
- Column 2: Quick Links (nav links)
- Column 3: Popular Destinations (hardcoded top 4)
- Column 4: Contact info (phone, email, address from `SITE_CONFIG`)
- Bottom bar: copyright with current year

- [ ] **Step 3: Create Mobile Nav component**

Create `src/components/layout/mobile-nav.tsx` — Sheet-based slide-in nav for mobile. Uses Shadcn `Sheet` with `SheetContent` side="left". Lists all `NAV_LINKS` with close-on-click behavior.

- [ ] **Step 4: Create public layout**

Create `src/app/(public)/layout.tsx`:

```typescript
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify layout renders**

```bash
npm run dev
```

Open `http://localhost:3000` — should see header and footer.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ src/app/\(public\)/
git commit -m "feat: add responsive header, footer, mobile nav, and public layout"
```

---

### Task 8: Shared Components

**Files:**
- Create: `src/components/shared/section-heading.tsx`
- Create: `src/components/shared/tour-card.tsx`
- Create: `src/components/shared/price-tag.tsx`
- Create: `src/components/shared/stats-counter.tsx`
- Create: `src/components/shared/testimonial-carousel.tsx`
- Create: `src/components/shared/image-gallery.tsx`
- Create: `src/components/shared/status-badge.tsx`
- Create: `src/components/shared/search-bar.tsx`

- [ ] **Step 1: Create SectionHeading**

```typescript
// src/components/shared/section-heading.tsx
"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 h-1 w-20 bg-primary rounded-full mx-auto" />
    </motion.div>
  );
}
```

- [ ] **Step 2: Create TourCard**

A reusable card for destinations and packages. Accepts `variant: "destination" | "package"`. Shows image with hover zoom, title, badge (region or category), and price (for packages). Uses Shadcn `Card`, Framer Motion hover animation.

```typescript
// src/components/shared/tour-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "./price-tag";

interface TourCardProps {
  title: string;
  slug: string;
  image: string;
  badge: string;
  href: string;
  price?: number;
  duration?: string;
  groupSize?: string;
  packageCount?: number;
}

export function TourCard({
  title,
  slug,
  image,
  badge,
  href,
  price,
  duration,
  groupSize,
  packageCount,
}: TourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <Link href={href}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge className="absolute top-4 left-4 bg-primary/90">{badge}</Badge>
            {price && (
              <div className="absolute top-4 right-4">
                <PriceTag price={price} />
              </div>
            )}
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {duration}
                </span>
              )}
              {groupSize && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {groupSize}
                </span>
              )}
              {packageCount !== undefined && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {packageCount} Packages
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create PriceTag**

```typescript
// src/components/shared/price-tag.tsx
import { formatPrice } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  period?: string;
}

export function PriceTag({ price, period = "per person" }: PriceTagProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
      <span className="text-lg font-bold text-primary">{formatPrice(price)}</span>
      <span className="text-xs text-muted-foreground block">{period}</span>
    </div>
  );
}
```

- [ ] **Step 4: Create StatsCounter**

Animated counter that counts from 0 to target number when visible:

```typescript
// src/components/shared/stats-counter.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

export function StatsCounter({ value, label, suffix = "" }: StatsCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl font-bold text-primary md:text-5xl">
        {count.toLocaleString("en-IN")}
        {suffix}
      </div>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </motion.div>
  );
}
```

- [ ] **Step 5: Create TestimonialCarousel**

Auto-sliding testimonial cards using Shadcn Carousel (built on Embla):

```typescript
// src/components/shared/testimonial-carousel.tsx
"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: true }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent className="-ml-4">
        {testimonials.map((t) => (
          <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < t.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
```

- [ ] **Step 6: Create ImageGallery**

Lightbox gallery for package/destination detail pages:

```typescript
// src/components/shared/image-gallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
          onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}>
          <Image src={images[0]} alt={alt} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="100vw" priority />
        </div>
        {images.slice(1, 3).map((img, i) => (
          <div key={i} className="relative h-[250px] rounded-xl overflow-hidden cursor-pointer"
            onClick={() => { setCurrentIndex(i + 1); setLightboxOpen(true); }}>
            <Image src={img} alt={`${alt} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="50vw" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
          {images.length > 1 && (
            <>
              <Button variant="ghost" size="icon" className="absolute left-4 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}>
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-4 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}>
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
          <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[currentIndex]} alt={alt} fill className="object-contain" sizes="90vw" />
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 7: Create StatusBadge**

```typescript
// src/components/shared/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUSES } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const config = BOOKING_STATUSES.find((s) => s.value === status);
  return (
    <Badge variant="outline" className={config?.color ?? ""}>
      {config?.label ?? status}
    </Badge>
  );
}
```

- [ ] **Step 8: Create SearchBar**

```typescript
// src/components/shared/search-bar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

export function SearchBar({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (travelers) params.set("travelers", travelers);
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-3xl mx-auto">
      <Select value={destination} onValueChange={setDestination}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Where to?" />
        </SelectTrigger>
        <SelectContent>
          {destinations.map((d) => (
            <SelectItem key={d.id} value={d.slug}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Travelers"
        min={1}
        max={50}
        value={travelers}
        onChange={(e) => setTravelers(e.target.value)}
        className="w-full sm:w-32"
      />
      <Button onClick={handleSearch} size="lg" className="gap-2">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add all shared components — TourCard, StatsCounter, Carousel, Gallery, etc."
```

---

### Task 9: Home Page

**Files:**
- Create: `src/app/(public)/page.tsx`

- [ ] **Step 1: Build the home page**

Create `src/app/(public)/page.tsx` as a Server Component that fetches data:

```typescript
import { Metadata } from "next";
import { db } from "@/lib/db";
import { SITE_CONFIG, STATS } from "@/lib/constants";
import { HeroSection } from "./sections/hero";
import { DestinationsSection } from "./sections/destinations";
import { PackagesSection } from "./sections/packages";
import { WhyChooseUs } from "./sections/why-choose-us";
import { TestimonialsSection } from "./sections/testimonials";
import { CabsCTA } from "./sections/cabs-cta";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export const revalidate = 60;

export default async function HomePage() {
  const [destinations, packages, testimonials] = await Promise.all([
    db.destination.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { packages: true } } },
    }),
    db.package.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { destination: { select: { name: true } } },
    }),
    db.testimonial.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <HeroSection destinations={destinations} />
      <DestinationsSection destinations={destinations} />
      <PackagesSection packages={packages} />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <CabsCTA />
    </>
  );
}
```

- [ ] **Step 2: Create home page sections**

Create each section as a separate file in `src/app/(public)/sections/`:

- `hero.tsx` — Full-viewport hero with background image, gradient overlay, animated heading, search bar. Uses Framer Motion `stagger` for text reveal.
- `destinations.tsx` — Section heading + 6 `TourCard` components in a responsive grid (1/2/3 cols). Each card links to `/destinations/[slug]`.
- `packages.tsx` — Section heading + horizontal carousel of featured packages using Shadcn Carousel.
- `why-choose-us.tsx` — 4 `StatsCounter` components in a grid with icons (Shield, Map, Users, Headphones from Lucide).
- `testimonials.tsx` — Section heading + `TestimonialCarousel` component.
- `cabs-cta.tsx` — Full-width banner with background image, text "Need a Ride?", and "Explore Cab Services" button linking to `/cabs`.

Each section uses the `SectionHeading` component and wraps in `<section className="py-20 px-4">` with alternating `bg-muted/50` backgrounds.

- [ ] **Step 3: Verify home page renders**

```bash
npm run dev
```

Check all sections display correctly with animations.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/
git commit -m "feat: build home page with hero, destinations, packages, stats, testimonials, CTA"
```

---

### Task 10: Destinations Pages

**Files:**
- Create: `src/app/(public)/destinations/page.tsx`
- Create: `src/app/(public)/destinations/[slug]/page.tsx`

- [ ] **Step 1: Create destinations list page**

Server Component that fetches all destinations with pagination and optional region filter. Uses `searchParams` for `?region=North+India&page=1`. Displays `TourCard` grid with `packageCount`. Include `generateMetadata` for SEO.

- [ ] **Step 2: Create destination detail page**

Server Component with `generateStaticParams` for SSG. Fetches destination by slug with related packages. Shows hero banner, description, and package grid below. Include JSON-LD structured data. `generateMetadata` with dynamic title/description.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/destinations/
git commit -m "feat: add destinations list and detail pages with filtering and SEO"
```

---

### Task 11: Packages Pages

**Files:**
- Create: `src/app/(public)/packages/page.tsx`
- Create: `src/app/(public)/packages/[slug]/page.tsx`

- [ ] **Step 1: Create packages list page**

Server Component with filters: category, destination, price range (via searchParams). Sorting by price and newest. Paginated grid of `TourCard` components. Supports incoming params from home page search bar (`?destination=manali&travelers=4`).

- [ ] **Step 2: Create package detail page**

Server Component with `generateStaticParams`. Shows:
- `ImageGallery` at top
- Price, duration, group size in a highlight bar
- Day-by-day itinerary using Shadcn `Accordion`
- Inclusions (green checkmarks) / Exclusions (red X) lists
- Sticky "Book This Package" button → links to `/book/[id]`
- Related packages carousel (same destination, exclude current)
- JSON-LD TouristTrip structured data
- `generateMetadata` with price, destination in description

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/packages/
git commit -m "feat: add packages list and detail pages with filters, itinerary, and SEO"
```

---

### Task 12: Cab Services, About, Contact Pages

**Files:**
- Create: `src/app/(public)/cabs/page.tsx`
- Create: `src/app/(public)/about/page.tsx`
- Create: `src/app/(public)/contact/page.tsx`

- [ ] **Step 1: Create Cabs page**

Fetch all cab types from DB. Display as cards (image, name, capacity, price/km). Below cards: inline cab booking form using React Hook Form + Zod (`cabBookingSchema`). Form submits via Server Action (created in Phase 3).

- [ ] **Step 2: Create About page**

Static content page with:
- Company story section
- Stats counters (reuse `StatsCounter`)
- Mission & Vision cards (side by side)
- "Why Travelers Choose Us" — 4 feature cards with Lucide icons

- [ ] **Step 3: Create Contact page**

Contact form (React Hook Form + Zod `contactSchema`). Google Maps embed (iframe with placeholder coordinates). Contact info from `SITE_CONFIG`. Form submits via Server Action.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/cabs/ src/app/\(public\)/about/ src/app/\(public\)/contact/
git commit -m "feat: add cab services, about, and contact pages"
```

---

## Phase 3: Booking System & Server Actions

### Task 13: Server Actions for Bookings

**Files:**
- Create: `src/app/actions/booking.ts`
- Create: `src/app/actions/cab-booking.ts`
- Create: `src/app/actions/contact.ts`

- [ ] **Step 1: Create package booking action**

Create `src/app/actions/booking.ts`:

```typescript
"use server";

import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validations/booking";
import { generateReferenceNo, formatDate } from "@/lib/utils";
import { sendBookingConfirmation, sendBookingAlertToAdmin } from "@/lib/email";

export async function createBooking(formData: FormData) {
  const raw = {
    packageId: formData.get("packageId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    travelers: Number(formData.get("travelers")),
    date: formData.get("date"),
    notes: formData.get("notes"),
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const referenceNo = await generateReferenceNo("WQ");

  const pkg = await db.package.findUnique({
    where: { id: parsed.data.packageId },
    select: { title: true },
  });

  if (!pkg) {
    return { error: { packageId: ["Package not found"] } };
  }

  const booking = await db.booking.create({
    data: {
      referenceNo,
      packageId: parsed.data.packageId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      travelers: parsed.data.travelers,
      date: parsed.data.date,
      notes: parsed.data.notes,
    },
  });

  // Send emails (don't block response)
  const emailData = {
    referenceNo,
    customerName: parsed.data.name,
    customerEmail: parsed.data.email,
    packageTitle: pkg.title,
    travelDate: formatDate(parsed.data.date),
    travelers: parsed.data.travelers,
  };

  sendBookingConfirmation(emailData).catch(console.error);
  sendBookingAlertToAdmin(emailData).catch(console.error);

  return { success: true, referenceNo: booking.referenceNo };
}
```

- [ ] **Step 2: Create cab booking action**

Create `src/app/actions/cab-booking.ts` — same pattern as booking but uses `cabBookingSchema`, `CabBooking` model, and cab-specific email templates. Reference format: `WQ-CAB-YYYYMM-XXXXX`.

- [ ] **Step 3: Create contact action**

Create `src/app/actions/contact.ts` — validates with `contactSchema`, creates `Inquiry` record, sends `sendInquiryAlert` email to admin.

- [ ] **Step 4: Commit**

```bash
git add src/app/actions/
git commit -m "feat: add server actions for bookings, cab bookings, and contact inquiries"
```

---

### Task 14: Booking Page

**Files:**
- Create: `src/app/(public)/book/[packageId]/page.tsx`
- Create: `src/components/shared/booking-form.tsx`

- [ ] **Step 1: Create BookingForm component**

Client component using React Hook Form + Zod resolver. Fields: name, email, phone, travelers (number input), date (date picker using Shadcn Calendar + Popover), notes (textarea). Hidden `packageId` field. Uses `useFormState` with the `createBooking` server action. Shows success state with reference number on completion.

- [ ] **Step 2: Create booking page**

Server Component that fetches package by ID. Shows package summary (image, title, price, duration) in a sidebar on desktop / top card on mobile. Renders `BookingForm` with the package ID. `generateMetadata` with "Book [Package Name]" title.

- [ ] **Step 3: Wire cab booking form on /cabs page**

Update the cabs page to use a similar form component wired to the `createCabBooking` server action. Show success toast on completion using Shadcn `Sonner`.

- [ ] **Step 4: Wire contact form on /contact page**

Update the contact page form to use the `createContactInquiry` server action. Show success toast.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/book/ src/components/shared/booking-form.tsx src/app/\(public\)/cabs/ src/app/\(public\)/contact/
git commit -m "feat: add booking page and wire all forms to server actions"
```

---

## Phase 4: Admin Dashboard

### Task 15: Admin Layout & Login

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/components/layout/admin-sidebar.tsx`

- [ ] **Step 1: Create admin sidebar**

Create `src/components/layout/admin-sidebar.tsx` — vertical sidebar with Lucide icons for each admin page:
- Dashboard (LayoutDashboard)
- Bookings (CalendarCheck)
- Cab Bookings (Car)
- Destinations (MapPin)
- Packages (Package)
- Cab Types (Truck)
- Inquiries (MessageSquare)
- Testimonials (Star)
- Sign Out button at bottom

Use Shadcn `Button` with `variant="ghost"` for nav items. Highlight active route using `usePathname()`.

- [ ] **Step 2: Create admin layout**

Create `src/app/admin/layout.tsx` — sidebar + main content area. Check session from `auth()`. If not authenticated and not on login page, redirect.

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen">
      {session && <AdminSidebar />}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create login page**

Create `src/app/admin/login/page.tsx` — centered login card with email + password fields. Uses `signIn` from NextAuth on form submit. Shows error toast on invalid credentials. Redirects to `/admin` on success.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/ src/components/layout/admin-sidebar.tsx
git commit -m "feat: add admin layout with sidebar navigation and login page"
```

---

### Task 16: Admin Dashboard Overview

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Build dashboard page**

Server Component. Fetch aggregate data:
- Total bookings (all time)
- This month's bookings
- Pending bookings count
- Confirmed bookings count
- Last 10 package bookings
- Last 5 cab bookings
- Last 5 inquiries (unread)

Display as:
- 4 stat cards at top (Shadcn Card with icon, label, count)
- "Recent Bookings" table below (Shadcn Table)
- "Recent Inquiries" sidebar or section below

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add admin dashboard overview with stats and recent activity"
```

---

### Task 17: Admin Bookings Management

**Files:**
- Create: `src/app/admin/bookings/page.tsx`
- Create: `src/app/admin/cab-bookings/page.tsx`
- Create: `src/app/actions/admin/update-booking-status.ts`

- [ ] **Step 1: Create status update action**

Create `src/app/actions/admin/update-booking-status.ts`:

```typescript
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendStatusUpdate } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(
  bookingId: string,
  newStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });

  sendStatusUpdate(
    booking.email,
    booking.name,
    booking.referenceNo,
    newStatus,
    "package"
  ).catch(console.error);

  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function updateCabBookingStatus(
  bookingId: string,
  newStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const booking = await db.cabBooking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  });

  sendStatusUpdate(
    booking.email,
    booking.name,
    booking.referenceNo,
    newStatus,
    "cab"
  ).catch(console.error);

  revalidatePath("/admin/cab-bookings");
  return { success: true };
}
```

- [ ] **Step 2: Create bookings admin page**

Server Component with searchParams for status filter, date range, and page number. Fetches bookings with package info. Displays in Shadcn `Table` with:
- Columns: Reference, Customer, Package, Date, Status, Actions
- Status column uses `StatusBadge`
- Actions: `DropdownMenu` with status change options
- Pagination controls at bottom

- [ ] **Step 3: Create cab bookings admin page**

Same pattern as bookings but for `CabBooking` model. Columns: Reference, Customer, Cab Type, Route (pickup → drop), Date/Time, Status, Actions.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/bookings/ src/app/admin/cab-bookings/ src/app/actions/admin/
git commit -m "feat: add admin bookings and cab bookings management with status updates"
```

---

### Task 18: Admin CRUD — Destinations

**Files:**
- Create: `src/app/admin/destinations/page.tsx`
- Create: `src/app/admin/destinations/new/page.tsx`
- Create: `src/app/admin/destinations/[id]/edit/page.tsx`
- Create: `src/app/actions/admin/destinations.ts`
- Create: `src/components/shared/image-uploader.tsx`

- [ ] **Step 1: Create ImageUploader component**

Client component for Cloudinary upload:
- Click or drag-drop to select image
- Calls `/api/cloudinary/sign` to get signed params
- Uploads directly to Cloudinary from browser
- Shows upload progress
- Returns the Cloudinary URL via `onChange` callback
- Shows preview of uploaded image

- [ ] **Step 2: Create destination server actions**

Create `src/app/actions/admin/destinations.ts` with:
- `createDestination(formData)` — validates, generates slug, creates record
- `updateDestination(id, formData)` — validates, updates record
- `deleteDestination(id)` — deletes record (with cascade check)
- All actions check auth session and `revalidatePath`

- [ ] **Step 3: Create destinations list page**

Table of all destinations with columns: Image (thumbnail), Name, Region, Packages Count, Featured, Actions (Edit/Delete). "Add Destination" button at top.

- [ ] **Step 4: Create add/edit destination pages**

Form with: name, description (textarea), region (select from `REGIONS`), image (ImageUploader), featured (Switch). Edit page pre-fills from DB.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/destinations/ src/app/actions/admin/destinations.ts src/components/shared/image-uploader.tsx
git commit -m "feat: add admin destinations CRUD with Cloudinary image upload"
```

---

### Task 19: Admin CRUD — Packages

**Files:**
- Create: `src/app/admin/packages/page.tsx`
- Create: `src/app/admin/packages/new/page.tsx`
- Create: `src/app/admin/packages/[id]/edit/page.tsx`
- Create: `src/app/actions/admin/packages.ts`

- [ ] **Step 1: Create package server actions**

Create `src/app/actions/admin/packages.ts` — CRUD actions for packages. `create` and `update` handle:
- Basic fields (title, price, duration, groupSize, category)
- Destination select (fetch destinations for dropdown)
- Itinerary as dynamic JSON (array of day objects)
- Inclusions/Exclusions as string arrays (tag input)
- Multiple image URLs (from Cloudinary)
- Auto-generate slug from title

- [ ] **Step 2: Create packages list page**

Table: Title, Destination, Price, Duration, Category, Featured, Actions.

- [ ] **Step 3: Create add/edit package pages**

Complex form with:
- Basic fields (inputs, selects)
- Destination dropdown (fetched from DB)
- Category select from `CATEGORIES`
- Itinerary builder: dynamic form where you add day-by-day items (day number, title, description). "Add Day" button appends a new row.
- Inclusions/Exclusions: tag-style inputs where you type and press Enter to add items
- Multiple ImageUploader instances for gallery
- Featured toggle (Switch)

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/packages/ src/app/actions/admin/packages.ts
git commit -m "feat: add admin packages CRUD with itinerary builder and multi-image upload"
```

---

### Task 20: Admin CRUD — Cabs, Inquiries, Testimonials

**Files:**
- Create: `src/app/admin/cabs/page.tsx`
- Create: `src/app/admin/inquiries/page.tsx`
- Create: `src/app/admin/testimonials/page.tsx`
- Create: `src/app/actions/admin/cabs.ts`
- Create: `src/app/actions/admin/inquiries.ts`
- Create: `src/app/actions/admin/testimonials.ts`

- [ ] **Step 1: Create cab types admin page**

Dialog-based CRUD (no separate pages needed — simpler model). Table with inline "Add" button that opens a Dialog form. Edit/Delete via row actions. Fields: name, description, pricePerKm, capacity, image.

- [ ] **Step 2: Create inquiries admin page**

Read-only table with: Name, Email, Phone, Date, Read status. Click row to open Sheet with full message. "Mark as Read" action. No create/edit needed.

- [ ] **Step 3: Create testimonials admin page**

Dialog-based CRUD. Table showing: Name, Location, Rating (stars), Featured, Actions. Dialog form: name, location, rating (1-5 select), review (textarea), avatar (optional ImageUploader), featured toggle.

- [ ] **Step 4: Create corresponding server actions**

One file each for cabs, inquiries, and testimonials with CRUD operations. All check auth session.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/cabs/ src/app/admin/inquiries/ src/app/admin/testimonials/ src/app/actions/admin/
git commit -m "feat: add admin CRUD for cab types, inquiries, and testimonials"
```

---

## Phase 5: Polish & SEO

### Task 21: SEO, Sitemap, Error Pages

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/loading.tsx`
- Modify: `src/app/layout.tsx` (root metadata)

- [ ] **Step 1: Create sitemap generator**

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wanderquest.com";

  const destinations = await db.destination.findMany({ select: { slug: true, updatedAt: true } });
  const packages = await db.package.findMany({ select: { slug: true, updatedAt: true } });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/cabs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...destinations.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...packages.map((p) => ({
      url: `${baseUrl}/packages/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
```

- [ ] **Step 2: Create robots.txt**

```typescript
// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/admin/" },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Create error pages**

- `not-found.tsx` — Friendly 404 with illustration, "Go Home" button
- `error.tsx` — Client component error boundary with "Try Again" button
- `loading.tsx` — Full-page skeleton with shimmer animation

- [ ] **Step 4: Add root metadata**

Update `src/app/layout.tsx` to include comprehensive `Metadata` export with Open Graph, Twitter card, viewport, theme color, and site-wide defaults.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/not-found.tsx src/app/error.tsx src/app/loading.tsx src/app/layout.tsx
git commit -m "feat: add sitemap, robots.txt, error pages, and root SEO metadata"
```

---

### Task 22: Final Polish

**Files:**
- Create: `next.config.ts` (update for images)
- Create: `CLAUDE.md`

- [ ] **Step 1: Configure Next.js for external images**

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Build and fix any errors**

```bash
npm run build
```

Fix any TypeScript errors, missing imports, or build failures.

- [ ] **Step 3: Create CLAUDE.md**

Create `CLAUDE.md` at project root with build commands, architecture overview, and dev workflow info.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: finalize configuration, build check, and project documentation"
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Foundation | Tasks 1-6 | Scaffolded project, DB, seed data, auth, email, cloudinary |
| 2: Public Pages | Tasks 7-12 | All 9 customer-facing pages with animations and SEO |
| 3: Booking System | Tasks 13-14 | Server actions, booking forms, email notifications |
| 4: Admin Dashboard | Tasks 15-20 | Login, overview, CRUD for all entities |
| 5: Polish | Tasks 21-22 | Sitemap, robots, error pages, build verification |

Total: **22 tasks**, each producing a working commit. The site is fully functional after Phase 4, with Phase 5 adding production polish.
