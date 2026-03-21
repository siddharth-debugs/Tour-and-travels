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
