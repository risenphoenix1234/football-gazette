// app/about/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import BackButton from "@/components/layout/BackButton";
import ContactBlock from "@/components/legal/ContactBlock";

export const metadata: Metadata = {
  title: "About | Football Gazette",
  description:
    "Football Gazette is a football media brand built by fans, for fans.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <section className="bg-white pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <BackButton />

          <p className="text-sm font-bold uppercase tracking-wide text-purple-700 sm:text-base">
            About
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-black sm:text-4xl lg:text-5xl">
            About Football Gazette
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700 sm:mt-10 sm:text-lg">
            <p>
              Football Gazette is a football media brand built by fans, for
              fans. We cover the game we love across every angle — match
              reactions, player ratings, transfer stories, rankings, and the
              debates that keep football alive — delivered through video,
              social content, and this website.
            </p>

            <p>
              What started as a small team with big opinions has grown into a
              community spanning the UK, Nigeria, and beyond. Our mission is
              simple: bring you sharp, honest, entertaining football content,
              and give our community a place to argue, predict, and play
              along.
            </p>

            <p>
              Beyond our coverage, we run the{" "}
              <span className="font-black text-purple-700">
                Football Gazette Fantasy Premier League
              </span>{" "}
              — our own competitive fantasy league where members go head-to-head
              across the season for real prizes, bragging rights, and a bit of
              chaos in the group chat.
            </p>

            <p className="font-bold text-black">
              Whether you&apos;re here for the takes, the content, or the
              competition, welcome to the Gazette.
            </p>
          </div>

          <ContactBlock />
        </div>
      </section>
    </>
  );
}