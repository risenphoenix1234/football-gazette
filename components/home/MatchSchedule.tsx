// components/home/MatchSchedule.tsx

import Image from "next/image";
import { getUpcomingEPLFixtures } from "@/lib/football-data";
import Countdown from "./Countdown";

export default async function MatchSchedule() {
  let fixtures: Awaited<ReturnType<typeof getUpcomingEPLFixtures>> = [];

  try {
    fixtures = await getUpcomingEPLFixtures(5);
  } catch (err) {
    console.error("MatchSchedule: failed to load fixtures", err);
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-slate-500">
            Fixtures are temporarily unavailable. Check back shortly.
          </p>
        </div>
      </section>
    );
  }

  if (fixtures.length === 0) {
    return null;
  }

  // fixtures are date-sorted ascending — [0] is always the soonest, the one the countdown targets
  const [featured, ...rest] = fixtures;
  const featuredDate = new Date(featured.dateISO);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[34px] font-black uppercase text-slate-900">
            Match Schedule
          </h2>

          <p className="mt-2 text-slate-500">
            Upcoming fixtures and countdown
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left Image */}
          <div className="relative w-full lg:w-[620px] h-[530px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1400&auto=format&fit=crop"
              alt={`${featured.homeName} vs ${featured.awayName}`}
              fill
              className="object-cover"
              unoptimized
            />

            <div className="absolute inset-0 bg-black/40" />

            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                `${featured.homeName} vs ${featured.awayName} highlights`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Search YouTube for ${featured.homeName} vs ${featured.awayName} highlights`}
            >
              <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                <svg
                  className="w-10 h-10 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </a>

            <div className="absolute bottom-0 left-0 right-0 bg-purple-700 p-8">
              <p className="text-orange-300 text-xl font-bold text-center">
                {featuredDate.toLocaleDateString("en-GB", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <h3 className="mt-2 text-center text-white text-4xl font-black uppercase">
                {featured.homeName} VS {featured.awayName}
              </h3>

              <div className="mt-4 flex justify-center">
                <div className="w-24 h-3 bg-white">
                  <div className="h-full w-1/2 bg-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Schedule Card */}
          <div className="w-full max-w-[450px] bg-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">

            <div className="bg-purple-700 h-[70px] flex items-center justify-center">
              <h3 className="text-white text-[28px] font-extrabold uppercase">
                Next Match
              </h3>
            </div>

            <div className="px-12 py-10">

              {fixtures.map((match) => {
                const matchDate = new Date(match.dateISO);
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between mb-10 last:mb-0"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-[60px] h-[60px]">
                        <Image
                          src={match.homeBadge}
                          alt={match.homeName}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-xs text-gray-500 text-center">
                        {match.homeName}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[28px] font-bold text-gray-500">
                        VS
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {matchDate.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="text-xs text-gray-400">
                        {matchDate.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-[60px] h-[60px]">
                        <Image
                          src={match.awayBadge}
                          alt={match.awayName}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-xs text-gray-500 text-center">
                        {match.awayName}
                      </span>
                    </div>
                  </div>
                );
              })}

              <Countdown targetISO={featured.dateISO} />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}