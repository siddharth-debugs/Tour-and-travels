# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WanderQuest Travels — a tour & travels website built with Next.js 15 App Router, Shadcn/ui, Tailwind CSS v4, and Prisma ORM.

## Commands

- `npm run dev` — Start development server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npx tsc --noEmit` — Type check
- `npx prisma generate` — Regenerate Prisma client after schema changes
- `npx prisma db push` — Push schema changes to database
- `npx prisma db seed` — Seed database with sample data
- `npx prisma studio` — Open Prisma Studio (DB browser)

## Architecture

- **Framework:** Next.js 15 App Router (Server Components + Server Actions)
- **UI:** Shadcn/ui v4 (uses @base-ui/react — NOT @radix-ui. Use `render={<Component />}` instead of `asChild`)
- **Styling:** Tailwind CSS v4 with CSS custom properties for theming
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** NextAuth.js v5 (credentials-based admin auth)
- **Email:** Resend
- **Images:** Cloudinary (signed uploads)

## Key Patterns

- **Theming:** All colors are CSS variables in `src/app/globals.css`. Change `--primary`, `--secondary`, `--accent` to rebrand.
- **Route groups:** `(public)` for customer pages, `admin` for dashboard
- **Server Actions:** Located in `src/app/actions/` — all mutations go through server actions
- **Validation:** Zod schemas in `src/lib/validations/` — shared between client forms and server actions
- **Constants:** Site config, nav links, categories, regions in `src/lib/constants.ts`
- **Shadcn/ui v4:** Components use `render` prop (not `asChild`). Example: `<SheetTrigger render={<Button />}>`

## Database

Schema at `prisma/schema.prisma`. Models: Destination, Package, CabType, Booking, CabBooking, Inquiry, Testimonial.

## Environment Variables

See `.env.example` for all required variables. Copy to `.env.local` for development.

Required services: Neon (DB), Resend (email), Cloudinary (images).
