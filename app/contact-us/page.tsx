// app/contact-us/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/FooterBar";
import BackButton from "@/components/layout/BackButton";

export const metadata: Metadata = {
  title: "Contact Us | Football Gazette",
  description:
    "Get in touch with Football Gazette — story tips, corrections, partnerships, or general enquiries.",
};

const SOCIALS = [
  { label: "Instagram", handle: "@Footballgazettehq", href: "https://instagram.com/Footballgazettehq" },
  { label: "YouTube", handle: "@FootballGazette", href: "https://youtube.com/@FootballGazette" },
  { label: "TikTok", handle: "@FootballGazette", href: "https://tiktok.com/@FootballGazette" },
  { label: "Facebook", handle: "Football Gazette", href: "https://facebook.com/FootballGazette" },
  { label: "X", handle: "FootballGazett1", href: "https://x.com/FootballGazett1" },
];

const CONTACT_EMAIL = "Footballgazette23@gmail.com";

export default function ContactUsPage() {
  return (
    <>
      <Navbar />
      <section className="bg-white pb-20 pt-24 sm:pb-28 sm:pt-28 lg:pb-36 lg:pt-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <BackButton />

          <p className="text-sm font-bold uppercase tracking-wide text-purple-700 sm:text-base">
            Get In Touch
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-tight text-black sm:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Got a story, a correction, a partnership idea, or just want to
            argue about Ronaldo vs Messi? Drop us a line.
          </p>

          <div className="mt-14 rounded-2xl border border-gray-100 bg-gray-50/60 p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 sm:text-sm">
              Email
            </p>
            
             <a href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block break-all text-xl font-black text-purple-700 transition hover:text-purple-900 sm:text-2xl"
            >
              {CONTACT_EMAIL}
            </a>

            <div className="mt-10 h-px w-full bg-gray-200" />

            <p className="mt-10 text-xs font-bold uppercase tracking-widest text-gray-400 sm:text-sm">
              Follow us
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-4 text-sm sm:text-base">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  
                   <a  href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-black transition hover:text-purple-700"
                  >
                    {s.label}
                    <span className="ml-1 font-semibold text-gray-500">
                      {s.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}