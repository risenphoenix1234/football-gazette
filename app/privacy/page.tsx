// app/privacy/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import BackButton from "@/components/layout/BackButton";
import ContactBlock from "@/components/legal/ContactBlock";

export const metadata: Metadata = {
  title: "Privacy Policy | Football Gazette",
  description: "Football Gazette's privacy policy.",
};

const COLLECTS = [
  {
    label: "Information you give us directly",
    body: "such as your name, email address, phone number, and social media handle when you register for our Fantasy League, contact us, or subscribe.",
  },
  {
    label: "Payment-related information",
    body: "when you pay a Fantasy League entry fee, payment is processed through our third-party payment provider (PalmPay). We receive confirmation of payment but do not store your full card or bank details.",
  },
  {
    label: "Technical information",
    body: "such as your device, browser, and usage data collected automatically through cookies and similar technologies when you visit the site.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <section className="bg-white pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <BackButton />

          <p className="text-sm font-bold uppercase tracking-wide text-purple-700 sm:text-base">
            Privacy
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-black sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Last updated: 25/08/2026
          </p>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-gray-700 sm:mt-10 sm:text-lg">
            <p>
              At Football Gazette, we respect your privacy. This policy
              explains what information we collect, how we use it, and your
              rights.
            </p>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Information we collect
              </h2>
              <ul className="space-y-3 pl-1">
                {COLLECTS.map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-700" />
                    <span>
                      <span className="font-bold text-black">{item.label}</span>{" "}
                      — {item.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                How we use your information
              </h2>
              <p>
                To register and manage your Fantasy League entry; to contact
                you about the league, prizes, and your account; to respond to
                your enquiries; to operate, improve, and secure our website;
                and to send you updates or content if you have opted in.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Sharing your information
              </h2>
              <p>
                We do not sell your personal data. We may share it with
                trusted service providers (such as payment processors and
                hosting providers) who help us run the site and the league,
                and where required by law.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Cookies
              </h2>
              <p>
                Our site uses cookies to help it function and to understand how
                visitors use it. You can control cookies through your browser
                settings.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Data retention
              </h2>
              <p>
                We keep your information only as long as needed for the
                purposes described here or as required by law.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Your rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal data, and you may withdraw consent to marketing at any
                time. To exercise these rights, contact us at{" "}
                
                  <a href="mailto:Footballgazette23@gmail.com"
                  className="font-bold text-purple-700 hover:underline"
                >
                  Footballgazette23@gmail.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Children
              </h2>
              <p>
                Our Fantasy League and paid features are intended for users
                aged 18 and over. We do not knowingly collect personal data
                from children.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Changes
              </h2>
              <p>
                We may update this policy from time to time. Changes will be
                posted on this page with a revised date.
              </p>
            </div>
          </div>

          <ContactBlock />
        </div>
      </section>
    </>
  );
}