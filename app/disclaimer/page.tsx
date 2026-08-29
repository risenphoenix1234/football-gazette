// app/disclaimer/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import BackButton from "@/components/layout/BackButton";

export const metadata: Metadata = {
  title: "Disclaimer | Football Gazette",
  description: "Football Gazette's disclaimer.",
};

const SECTIONS = [
  {
    heading: "Editorial content",
    body: "Opinions, predictions, rankings, and analysis published by Football Gazette are those of our team and contributors. They are personal views and commentary, not statements of fact. We make no guarantee that any prediction, rating, or opinion is accurate or will prove correct.",
  },
  {
    heading: "Accuracy of information",
    body: "We work to keep information — including transfer news, fixtures, and statistics — accurate and up to date, but football moves fast. We cannot guarantee that all content is complete, current, or error-free, and we accept no liability for any reliance placed on it.",
  },
  {
    heading: "Third-party content and links",
    body: "Our site may reference or link to third-party websites, clubs, competitions, and brands. Football Gazette is an independent brand and is not affiliated with, endorsed by, or officially connected to the Premier League, FIFA, any football club, or any player, unless expressly stated. All club names, logos, and trademarks belong to their respective owners.",
  },
  {
    heading: "Fantasy League",
    body: "The Football Gazette Fantasy Premier League is a private competition run by Football Gazette. Entry fees, prizes, and rules are set out at the point of entry and are subject to the conditions stated there (including any minimum-participation requirements that may affect prize amounts). Participation is voluntary. Please play responsibly.",
  },
  {
    heading: "No professional advice",
    body: "Nothing on this site constitutes financial, betting, legal, or professional advice.",
  },
];

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <section className="bg-white pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <BackButton />

          <p className="text-sm font-bold uppercase tracking-wide text-purple-700 sm:text-base">
            Disclaimer
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-black sm:text-4xl lg:text-5xl">
            Disclaimer
          </h1>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-gray-700 sm:mt-10 sm:text-lg">
            <p>
              The content on thefootballgazette.com is provided for general
              information and entertainment purposes only.
            </p>

            {SECTIONS.map((s) => (
              <div key={s.heading}>
                <h2 className="mb-3 text-lg font-black uppercase text-black sm:text-xl">
                  {s.heading}
                </h2>
                <p>{s.body}</p>
              </div>
            ))}

            <p className="border-t border-gray-200 pt-6 font-semibold text-black">
              To the fullest extent permitted by law, Football Gazette shall
              not be liable for any loss or damage arising from the use of this
              website or its content.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}