import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WanderQuest Travels — Discover Your Next Adventure",
    template: "%s | WanderQuest Travels",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "travel",
    "tour packages",
    "India tourism",
    "holiday packages",
    "cab booking",
    "Manali",
    "Goa",
    "Kerala",
    "Rajasthan",
    "Ladakh",
    "Andaman",
  ],
  authors: [{ name: "WanderQuest Travels" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "WanderQuest Travels",
    title: "WanderQuest Travels — Discover Your Next Adventure",
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "WanderQuest Travels",
    description: SITE_CONFIG.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
