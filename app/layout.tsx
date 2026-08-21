// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Football Gazette",
  description: "Football news, fixtures and tables",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="bg-slate-950 text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}