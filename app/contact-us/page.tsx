// app/contact-us/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/FooterBar";
import BackButton from "@/components/layout/BackButton";
import ContactForm from "@/components/contact/ContactForm";

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
      <section className="bg-white pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <BackButton />

          <p className="text-sm font-bold uppercase tracking-wide text-purple-700 sm:text-base">
            Get In Touch
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-black sm:text-4xl lg:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
            Got a story, a correction, a partnership idea, or just want to
            argue about Ronaldo vs Messi? Drop us a line.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: quick contact info */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-400 sm:text-base">
                Email
              </p>
              
               <a href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 inline-block break-all text-lg font-black text-purple-700 hover:underline sm:text-xl"
              >
                {CONTACT_EMAIL}
              </a>

              <p className="mt-8 text-sm font-bold uppercase tracking-wide text-gray-400 sm:text-base">
                Follow us
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm sm:text-base">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    
                  <a   href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-black hover:text-purple-700"
                    >
                      {s.label}:{" "}
                      <span className="font-semibold text-gray-600">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: quick message form */}
            <ContactForm contactEmail={CONTACT_EMAIL} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}