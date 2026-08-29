// app/accessibility/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import BackButton from "@/components/layout/BackButton";

export const metadata: Metadata = {
  title: "Accessibility | Football Gazette",
  description: "Football Gazette's accessibility statement.",
};

const COMMITMENTS = [
  "Clear, readable text with sufficient colour contrast",
  "Text alternatives for meaningful images",
  "Content that can be navigated by keyboard",
  "A layout that adapts to different screen sizes and devices",
];

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <section className="bg-white pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <BackButton />

          <p className="text-sm font-bold uppercase tracking-wide text-purple-700 sm:text-base">
            Accessibility
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-black sm:text-4xl lg:text-5xl">
            Accessibility Statement
          </h1>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-gray-700 sm:mt-10 sm:text-lg">
            <p>
              Football Gazette is committed to making thefootballgazette.com
              accessible to as many people as possible, including those who
              rely on assistive technologies.
            </p>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                What we&apos;re doing
              </h2>
              <p className="mb-4">
                We aim to follow recognised accessibility best practices,
                guided by the Web Content Accessibility Guidelines (WCAG) 2.1
                at Level AA. We work towards:
              </p>
              <ul className="space-y-2 pl-1">
                {COMMITMENTS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Ongoing work
              </h2>
              <p>
                Accessibility is an ongoing effort. Some areas of the site —
                particularly third-party embeds, video content, and social
                media integrations — may not yet be fully accessible, and we
                are working to improve them.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                Tell us
              </h2>
              <p>
                If you experience any difficulty accessing part of our website,
                or have a suggestion for how we can improve, please contact us
                at{" "}
                
                   <a href="mailto:Footballgazette23@gmail.com"
                  className="font-bold text-purple-700 hover:underline"
                >
                  Footballgazette23@gmail.com
                </a>
                . Let us know the page and the problem, and we&apos;ll do our
                best to help and to fix it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}