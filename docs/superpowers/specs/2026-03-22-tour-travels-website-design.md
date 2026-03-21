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
| Animations | Framer Motion | Scroll-triggered, page transitions, hover effects |
| Database | Neon PostgreSQL (free tier) | Serverless Postgres, works great with Vercel |
| ORM | Prisma | Type-safe queries, migrations, schema-first |
| Auth | NextAuth.js v5 | Admin-only credentials auth, session-based route protection |
| Email | Resend (free tier, 100/day) | Simple API, works on Vercel serverless |
| Image Storage | Cloudinary (free tier, 25GB) | Upload, transform, optimize, CDN delivery |
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
      cabs/page.tsx           — Cab services
      about/page.tsx          — About us
      contact/page.tsx        — Contact form
      book/[packageId]/page.tsx — Booking form
    admin/                    — Admin layout (sidebar, protected)
      page.tsx                — Dashboard overview
      bookings/page.tsx       — Manage bookings
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
      settings/page.tsx       — Site settings
    api/
      auth/[...nextauth]/route.ts
      uploadthing or cloudinary webhook
    layout.tsx                — Root layout
    not-found.tsx             — 404 page
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
    cloudinary.ts             — Upload helpers
    constants.ts              — Site-wide constants
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
  referenceNo String   @unique @default(cuid())
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
  referenceNo String   @unique @default(cuid())
  cabType     CabType  @relation(fields: [cabTypeId], references: [id])
  cabTypeId   String
  name        String
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

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

## Customer-Facing Pages

### Home Page (`/`)
Sections in scroll order:
1. **Hero** — Full-viewport with background video/image carousel, parallax effect, animated headline ("Discover Your Next Adventure"), search bar overlay
2. **Search Bar** — Destination dropdown, date picker, number of travelers. Prominent, usable.
3. **Popular Destinations** — 6 cards in animated grid, hover zoom effect on images, fade-in on scroll
4. **Featured Packages** — Horizontal scroll carousel with price badges, duration, destination tag
5. **Why Choose Us** — 4 icon cards with animated counters (500+ Tours, 10K+ Happy Travelers, 50+ Destinations, 24/7 Support)
6. **Testimonials** — Auto-sliding carousel with star ratings, customer photos
7. **Cab Services CTA** — Banner section linking to cabs page
8. **Newsletter** — Email capture with animated submit
9. **Footer** — Navigation links, social media, contact info, copyright

### Destinations (`/destinations`)
- Grid layout with search + filter (by region/type)
- Cards show destination image, name, package count
- Hover animation: image zoom + overlay with "Explore" CTA

### Destination Detail (`/destinations/[slug]`)
- Hero banner with destination image
- Description, highlights, weather/best-time info
- Related packages grid below
- Breadcrumb navigation

### Packages (`/packages`)
- Filterable grid: budget range, duration, destination, type (adventure/religious/honeymoon/family)
- Cards: image, title, price, duration, destination badge, "Book Now" CTA
- Sorting: price low-high, high-low, popular

### Package Detail (`/packages/[slug]`)
- Image gallery with lightbox
- Price, duration, group size prominently displayed
- Day-by-day itinerary (accordion)
- Inclusions/Exclusions lists with check/cross icons
- "Book This Package" sticky CTA button
- Related packages carousel

### Cab Services (`/cabs`)
- Cab types in cards (Sedan, SUV, Tempo Traveller, etc.)
- Each card: image, capacity, price per km, description
- Cab booking form (pickup, drop, date, time, cab type, phone)

### About Us (`/about`)
- Company story with parallax background
- Team section (if provided later)
- Stats counters (animated)
- Mission/Vision cards
- "Why travelers choose us" — trust signals

### Contact (`/contact`)
- Contact form (name, email, phone, message) with Zod validation
- Google Maps embed of office location
- Direct contact info: phone, email, address
- Social media links

### Booking (`/book/[packageId]`)
- Package summary sidebar (image, title, price, duration)
- Booking form: name, email, phone, travelers, preferred date, special requests
- Zod validation on client + server
- On success: confirmation screen with reference number

## Admin Dashboard

### Auth
- Single admin login via NextAuth credentials provider
- Email + password stored in env (hashed)
- Middleware-based route protection for `/admin/*`

### Dashboard Overview (`/admin`)
- Stats cards: Total Bookings, This Month, Pending, Confirmed
- Recent bookings table (last 10)
- Recent inquiries (last 5)

### Bookings Management (`/admin/bookings`)
- Data table with columns: Reference, Customer, Package, Date, Status, Actions
- Filters: status, date range
- Click to view full details in dialog/sheet
- Update status dropdown → triggers email to customer

### Destinations CRUD (`/admin/destinations/*`)
- List with edit/delete actions
- Add/Edit form: name, description, image upload (Cloudinary), featured toggle
- Slug auto-generated from name

### Packages CRUD (`/admin/packages/*`)
- List with edit/delete actions
- Add/Edit form: title, destination (select), price, duration, group size, itinerary builder (dynamic day-by-day fields), inclusions/exclusions (tag inputs), multiple image upload, featured toggle

### Cab Management (`/admin/cabs`)
- CRUD table inline or dialog-based
- Fields: name, description, price per km, capacity, image

### Inquiries (`/admin/inquiries`)
- List of contact form submissions
- Mark as read/unread
- View full message in dialog

### Settings (`/admin/settings`)
- Key-value store for dynamic site content
- Fields: site name, phone, email, address, social links, about text

## Email Templates

Two email flows using Resend + React Email:

1. **Booking Confirmation (to customer):**
   - Reference number, package name, travel date, traveler count
   - "We'll confirm your booking within 24 hours"

2. **New Booking Alert (to admin):**
   - All booking details, link to admin dashboard

3. **Status Update (to customer):**
   - When admin changes booking status (Confirmed/Cancelled)

4. **Contact Inquiry (to admin):**
   - Name, email, phone, message from contact form

## Animations Spec

Using Framer Motion throughout:

- **Page transitions:** Fade + slight Y-translate between routes
- **Scroll animations:** `whileInView` — sections fade-up as user scrolls
- **Card hover:** Scale 1.02, shadow increase, image zoom 1.1
- **Stats counters:** Animate from 0 to target number when in view
- **Hero:** Ken Burns effect on background images, text stagger animation
- **Carousel:** Spring-based sliding with drag gestures
- **Loading states:** Skeleton shimmer on data fetches
- **Buttons:** Subtle scale on press, hover glow

## SEO Strategy

- **SSG for all public pages** — pre-rendered at build time, ISR for dynamic content
- **Dynamic metadata** — per-page title, description, OG image via `generateMetadata()`
- **Structured Data (JSON-LD)** — TouristTrip, TravelAction schemas on package pages
- **Sitemap** — auto-generated via `next-sitemap`
- **robots.txt** — allow all public, block admin
- **Image optimization** — Next.js `<Image>` with Cloudinary loader, WebP, lazy loading
- **Semantic HTML** — proper heading hierarchy, landmarks, alt text
- **Core Web Vitals** — optimized LCP (hero preload), minimal CLS, fast FID

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
- **Cloudinary** — Image CDN (free tier, 25GB)
- **Resend** — Email (free tier, 100 emails/day)
- **Domain** — Client purchases separately, points to Vercel

## Seed Data

Development seed includes:
- 6 destinations (Manali, Goa, Kerala, Rajasthan, Ladakh, Andaman)
- 12 packages (2 per destination) with realistic itineraries
- 4 cab types (Sedan, SUV, Innova, Tempo Traveller)
- Sample bookings and inquiries
- Default admin credentials
- Default site settings
