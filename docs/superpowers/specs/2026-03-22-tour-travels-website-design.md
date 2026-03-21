# Tour & Travels Website — Design Spec

## Overview

A professional tour and travels website for an Indian travel business. Customer-facing site with booking system, admin dashboard for managing tours/bookings, email notifications, and full SEO optimization. No payment integration initially — bookings are inquiry-based with status tracking.

**Placeholder brand name:** WanderQuest Travels

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG for SEO, Server Components, Server Actions, API routes — single deployment |
| UI Library | Shadcn/ui + Radix primitives | Fully customizable, accessible, lightweight — not generic like MUI |
| Styling | Tailwind CSS v4 | Utility-first, pairs with Shadcn, global theming via CSS variables |
| Animations | Framer Motion | Scroll-triggered animations, hover effects, carousel gestures |
| Database | Neon PostgreSQL (free tier, 0.5GB) | Serverless Postgres, works great with Vercel. 0.5GB sufficient for years with image URLs only |
| ORM | Prisma | Type-safe queries, migrations, schema-first |
| Auth | NextAuth.js v5 | Admin-only credentials auth, session-based route protection |
| Email | Resend (free tier, 100/day) | Simple API, works on Vercel serverless. Sufficient for early stage (~50 bookings/day). Upgrade to paid tier ($20/mo) when volume grows |
| Image Storage | Cloudinary (free tier, 25GB) | Upload via signed URL, transform, optimize, CDN delivery |
| Validation | Zod + React Hook Form | Schema-based validation shared between client & server |
| Deployment | Vercel (free tier) | Zero cost, handles thousands of users |

## Global Theming

All theme values live in `src/styles/globals.css` as CSS custom properties:

```css
:root {
  --primary: 25 95% 53%;        /* Warm orange */
  --primary-foreground: 0 0% 100%;
  --secondary: 199 89% 48%;     /* Ocean blue */
  --accent: 142 76% 36%;        /* Nature green */
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --muted: 210 40% 96%;
  --card: 0 0% 100%;
  --border: 214 32% 91%;
  --radius: 0.75rem;
  /* ... full Shadcn variable set */
}
```

Changing these values updates the entire site. Shadcn components consume these variables natively. Tailwind config extends with these custom properties.

## Project Structure

```
src/
  app/
    (public)/                 — Customer-facing layout group
      page.tsx                — Home
      destinations/
        page.tsx              — Destinations grid
        [slug]/page.tsx       — Destination detail
      packages/
        page.tsx              — Packages grid
        [slug]/page.tsx       — Package detail
      cabs/page.tsx           — Cab services (includes inline cab booking form)
      about/page.tsx          — About us
      contact/page.tsx        — Contact form
      book/[packageId]/page.tsx — Booking form
    admin/                    — Admin layout (sidebar, protected)
      page.tsx                — Dashboard overview
      bookings/page.tsx       — Manage package bookings
      cab-bookings/page.tsx   — Manage cab bookings
      destinations/
        page.tsx              — List destinations
        new/page.tsx          — Add destination
        [id]/edit/page.tsx    — Edit destination
      packages/
        page.tsx              — List packages
        new/page.tsx          — Add package
        [id]/edit/page.tsx    — Edit package
      cabs/page.tsx           — Manage cab types
      inquiries/page.tsx      — Contact inquiries
    api/
      auth/[...nextauth]/route.ts
      cloudinary/sign/route.ts  — Signed upload URL generation
    layout.tsx                — Root layout
    not-found.tsx             — Custom 404 page
    error.tsx                 — Global error boundary
    loading.tsx               — Global loading skeleton
  components/
    ui/                       — Shadcn base components (Button, Card, Dialog, etc.)
    shared/                   — Business components
      tour-card.tsx
      booking-form.tsx
      section-heading.tsx
      stats-counter.tsx
      image-gallery.tsx
      testimonial-carousel.tsx
      search-bar.tsx
      price-tag.tsx
      status-badge.tsx
      data-table.tsx
      image-uploader.tsx
    layout/
      header.tsx
      footer.tsx
      mobile-nav.tsx
      admin-sidebar.tsx
  lib/
    db.ts                     — Prisma client singleton
    auth.ts                   — NextAuth config
    email.ts                  — Resend/email helpers
    cloudinary.ts             — Signed upload URL helpers
    constants.ts              — Site-wide constants (site name, phone, email, address, socials)
    utils.ts                  — cn() and shared utilities
    validations/              — Zod schemas (booking, contact, package, etc.)
  styles/
    globals.css               — CSS variables (theme), base styles
  prisma/
    schema.prisma
    seed.ts                   — Seed data for development
```

## Database Schema

```prisma
model Destination {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String
  region      String    // e.g. "North India", "South India", "East India", "West India"
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
  destination   Destination @relation(fields: [destinationId], references: [id])
  destinationId String
  price         Float
  duration      String      // e.g. "3 Days / 2 Nights"
  groupSize     String      // e.g. "2-10 People"
  category      String      // "adventure" | "religious" | "honeymoon" | "family" | "wildlife" | "beach"
  itinerary     Json        // Array of { day, title, description }
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
  name        String       // e.g. "Sedan", "SUV", "Tempo Traveller"
  description String
  pricePerKm  Float
  image       String
  capacity    Int
  cabBookings CabBooking[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Booking {
  id          String   @id @default(cuid())
  referenceNo String   @unique // Format: "WQ-YYYYMM-XXXXX" (e.g. "WQ-202603-00042"), generated server-side
  package     Package  @relation(fields: [packageId], references: [id])
  packageId   String
  name        String
  email       String
  phone       String
  travelers   Int
  date        DateTime
  notes       String?
  status      BookingStatus @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CabBooking {
  id          String   @id @default(cuid())
  referenceNo String   @unique // Format: "WQ-CAB-YYYYMM-XXXXX", generated server-side
  cabType     CabType  @relation(fields: [cabTypeId], references: [id])
  cabTypeId   String
  name        String
  email       String
  phone       String
  pickup      String
  drop        String
  date        DateTime
  time        String
  status      BookingStatus @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Inquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  location  String   // e.g. "Mumbai, India"
  avatar    String?  // Cloudinary URL, optional
  rating    Int      // 1-5
  review    String
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

**Reference number generation:** Server-side function that queries the last booking of the current month and increments a counter. Format: `WQ-YYYYMM-XXXXX` (zero-padded 5-digit sequential). For cab bookings: `WQ-CAB-YYYYMM-XXXXX`.

**Relationships:** Destination → has many Packages. Package → has many Bookings. CabType → has many CabBookings.

## Pagination Strategy

All list pages (public and admin) use **server-side offset pagination**:
- **Public pages** (destinations, packages): 12 items per page, URL param `?page=1`
- **Admin tables** (bookings, cab-bookings, inquiries): 20 items per page with server-side filtering
- Prisma `skip` + `take` with total count for page indicators

## Customer-Facing Pages

### Home Page (`/`)
Sections in scroll order:
1. **Hero** — Full-viewport with image carousel (3-4 stunning travel images via Cloudinary), Ken Burns zoom effect, animated headline ("Discover Your Next Adventure"), subtle gradient overlay
2. **Search Bar** — Destination dropdown, number of travelers. Links to `/packages?destination=X&travelers=Y`. No date filter (packages don't have date-based availability).
3. **Popular Destinations** — 6 cards in animated grid, hover zoom effect on images, fade-in on scroll
4. **Featured Packages** — Horizontal scroll carousel with price badges, duration, destination tag
5. **Why Choose Us** — 4 icon cards with animated counters (500+ Tours, 10K+ Happy Travelers, 50+ Destinations, 24/7 Support)
6. **Testimonials** — Auto-sliding carousel with star ratings, customer names. Data from `Testimonial` model (admin-managed).
7. **Cab Services CTA** — Banner section linking to cabs page
8. **Footer** — Navigation links, social media, contact info, copyright

**Newsletter removed** — no backend to support it. Can be added later with Resend audience lists.

### Destinations (`/destinations`)
- Grid layout with search + filter by region (North/South/East/West India)
- Cards show destination image, name, package count
- Hover animation: image zoom + overlay with "Explore" CTA
- Paginated (12 per page)

### Destination Detail (`/destinations/[slug]`)
- Hero banner with destination image
- Description, highlights
- Related packages grid below
- Breadcrumb navigation

### Packages (`/packages`)
- Filterable grid: budget range, duration, destination, category (adventure/religious/honeymoon/family/wildlife/beach)
- Cards: image, title, price, duration, destination badge, "Book Now" CTA
- Sorting: price low-high, high-low, newest
- Paginated (12 per page)
- Supports query params from home search bar: `?destination=X&travelers=Y`

### Package Detail (`/packages/[slug]`)
- Image gallery with lightbox
- Price, duration, group size prominently displayed
- Day-by-day itinerary (accordion)
- Inclusions/Exclusions lists with check/cross icons
- "Book This Package" sticky CTA button (links to `/book/[id]` — button reads the package `id` from server data, not slug)
- Related packages carousel (same destination)

### Cab Services (`/cabs`)
- Cab types in cards (Sedan, SUV, Tempo Traveller, etc.)
- Each card: image, capacity, price per km, description
- Inline cab booking form below cards (pickup, drop, date, time, cab type select, name, email, phone)
- Form submits via Server Action, shows confirmation with reference number on same page

### About Us (`/about`)
- Company story
- Stats counters (animated)
- Mission/Vision cards
- "Why travelers choose us" — trust signals

### Contact (`/contact`)
- Contact form (name, email, phone, message) with Zod validation
- Google Maps embed of office location (placeholder coordinates)
- Direct contact info: phone, email, address (from constants)
- Social media links

### Booking (`/book/[packageId]`)
- Package summary sidebar (image, title, price, duration) — fetched by package `id`
- Booking form: name, email, phone, travelers, preferred date, special requests
- Zod validation on client + server
- On success: confirmation screen with human-readable reference number

## Admin Dashboard

### Auth
- Single admin login via NextAuth credentials provider
- Admin email in `ADMIN_EMAIL` env var
- Password hash in `ADMIN_PASSWORD_HASH` env var (bcrypt)
- Setup: run `npx bcrypt-cli hash "yourpassword"` and paste result into `.env`
- Middleware-based route protection for `/admin/*`

### Dashboard Overview (`/admin`)
- Stats cards: Total Bookings, This Month, Pending, Confirmed
- Recent package bookings table (last 10)
- Recent cab bookings (last 5)
- Recent inquiries (last 5)

### Package Bookings Management (`/admin/bookings`)
- Data table with columns: Reference, Customer, Package, Date, Status, Actions
- Filters: status, date range
- Click to view full details in sheet/dialog
- Update status dropdown → triggers email to customer
- Paginated (20 per page)

### Cab Bookings Management (`/admin/cab-bookings`)
- Data table with columns: Reference, Customer, Cab Type, Pickup, Drop, Date, Status, Actions
- Filters: status, date range
- Update status → triggers email to customer
- Paginated (20 per page)

### Destinations CRUD (`/admin/destinations/*`)
- List with edit/delete actions
- Add/Edit form: name, description, region (select), image upload (Cloudinary), featured toggle
- Slug auto-generated from name

### Packages CRUD (`/admin/packages/*`)
- List with edit/delete actions
- Add/Edit form: title, destination (select), price, duration, group size, category (select), itinerary builder (dynamic day-by-day fields), inclusions/exclusions (tag inputs), multiple image upload, featured toggle

### Cab Management (`/admin/cabs`)
- CRUD table inline or dialog-based
- Fields: name, description, price per km, capacity, image

### Inquiries (`/admin/inquiries`)
- List of contact form submissions
- Mark as read/unread
- View full message in dialog

### Testimonials (`/admin/testimonials`) — added
- CRUD for customer testimonials
- Fields: name, location, rating (1-5), review text, avatar (optional), featured toggle

## Email Templates

Six email flows using Resend + React Email:

1. **Package Booking Confirmation (to customer):**
   - Reference number, package name, travel date, traveler count
   - "We'll confirm your booking within 24 hours"

2. **New Package Booking Alert (to admin):**
   - All booking details, link to admin dashboard

3. **Cab Booking Confirmation (to customer):**
   - Reference number, cab type, pickup/drop, date/time
   - "We'll confirm your cab booking shortly"

4. **New Cab Booking Alert (to admin):**
   - All cab booking details

5. **Status Update (to customer):**
   - When admin changes any booking status (Confirmed/Cancelled/Completed)
   - Applies to both package bookings and cab bookings

6. **Contact Inquiry (to admin):**
   - Name, email, phone, message from contact form

## Animations Spec

Using Framer Motion:

- **Scroll animations:** `whileInView` — sections fade-up as user scrolls
- **Card hover:** Scale 1.02, shadow increase, image zoom 1.1 (CSS transform, not Framer — lighter)
- **Stats counters:** Animate from 0 to target number when in view
- **Hero:** Ken Burns zoom effect on background images, text stagger animation
- **Carousel:** Spring-based sliding with drag gestures (testimonials, featured packages)
- **Loading states:** Skeleton shimmer on data fetches
- **Buttons:** Subtle scale on press via CSS `active:scale-95`

**Not implementing:** Page transitions between routes (App Router doesn't natively support exit animations — workarounds are fragile and not worth the complexity).

## SEO Strategy

- **SSG for all public pages** — pre-rendered at build time
- **ISR revalidation intervals:** Package/Destination list & detail pages: `revalidate: 60` (1 min). Static pages (about, contact, cabs): `revalidate: 3600` (1 hour). Home page: `revalidate: 60`.
- **Dynamic metadata** — per-page title, description, OG image via `generateMetadata()`
- **Structured Data (JSON-LD)** — TouristTrip, TravelAction schemas on package pages
- **Sitemap** — auto-generated via `next-sitemap`
- **robots.txt** — allow all public, block `/admin/*`
- **Image optimization** — Next.js `<Image>` with Cloudinary loader, WebP, lazy loading
- **Semantic HTML** — proper heading hierarchy, landmarks, alt text
- **Core Web Vitals** — optimized LCP (hero image preload), minimal CLS, fast FID

## Image Upload Flow (Cloudinary)

1. Admin clicks upload in form → client requests signed upload params from `/api/cloudinary/sign`
2. Server generates signature with Cloudinary API secret → returns `{ signature, timestamp, api_key, cloud_name }`
3. Client uploads directly to Cloudinary using signed params (no server bandwidth used)
4. Cloudinary returns URL → stored in DB via form submission
5. Public pages render images via Cloudinary CDN with Next.js `<Image>` loader for automatic format/size optimization

## Payment Integration (Future)

Architecture is designed for easy payment bolt-on:
- Booking form already collects all needed data
- Add `paymentStatus` and `paymentId` fields to Booking model
- Create `/api/payment/create-order` and `/api/payment/verify` routes
- Integrate Razorpay/Stripe checkout on the booking confirmation step
- Status flow becomes: PENDING → PAYMENT_PENDING → CONFIRMED → COMPLETED

## Deployment

- **Vercel** — Frontend + API routes + Server Actions (free tier)
- **Neon** — PostgreSQL database (free tier, 0.5GB)
- **Cloudinary** — Image CDN (free tier, 25GB). Hero images served from Cloudinary CDN (not self-hosted video — avoids Vercel bandwidth limits)
- **Resend** — Email (free tier, 100 emails/day — sufficient for ~30 bookings/day with headroom)
- **Domain** — Client purchases separately, points to Vercel

## Seed Data

Development seed includes:
- 6 destinations (Manali, Goa, Kerala, Rajasthan, Ladakh, Andaman) with regions assigned
- 12 packages (2 per destination) with realistic itineraries and categories
- 4 cab types (Sedan, SUV, Innova, Tempo Traveller)
- 6 testimonials with ratings
- Sample bookings, cab bookings, and inquiries
- Default admin credentials
