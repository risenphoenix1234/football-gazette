// app/layout.tsx (replaces existing file)
import type { Metadata } from "next";
import "../styles/globals.css";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  // Turns relative URLs in metadata (article links, preview images) into
  // absolute ones — link previews on WhatsApp/X/Facebook need full URLs.
  metadataBase: new URL(SITE_URL),
  title: "Football Gazette",
  description: "Football news, fixtures and tables",
  openGraph: {
    type: "website",
    siteName: "Football Gazette",
    title: "Football Gazette",
    description: "Football news, fixtures and tables",
    images: [{ url: "/logo.png", alt: "Football Gazette" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Football Gazette",
    description: "Football news, fixtures and tables",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="bg-slate-950 text-white overflow-x-hidden">
       <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}