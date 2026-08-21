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
      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-slate-500 text-sm sm:text-base">
            Fixtures are temporarily unavailable. Check back shortly.
          </p>
        </div>
      </section>
    );
  }

  if (fixtures.length === 0) {
    return null;
  }

  const [featured, ...rest] = fixtures;
  const featuredDate = new Date(featured.dateISO);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-[34px] font-black uppercase text-slate-900">
            Match Schedule
          </h2>

          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">
            Upcoming fixtures and countdown
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">

          {/* Left Image */}
          <div className="relative w-full lg:w-[620px] h-[320px] sm:h-[420px] lg:h-[530px] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1400&auto=format&fit=crop"
              alt={`${featured.homeName} vs ${featured.awayName}`}
              fill
              className="object-cover"
              unoptimized
            />

            <div className="absolute inset-0 bg-black/40" />

            
             <a  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                `${featured.homeName} vs ${featured.awayName} highlights`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Search YouTube for ${featured.homeName} vs ${featured.awayName} highlights`}
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </a>

            <div className="absolute bottom-0 left-0 right-0 bg-purple-700 p-4 sm:p-6 lg:p-8">
              <p className="text-orange-300 text-xs sm:text-base lg:text-xl font-bold text-center">
                {featuredDate.toLocaleDateString("en-GB", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <h3 className="mt-1 sm:mt-2 text-center text-white text-lg sm:text-2xl lg:text-4xl font-black uppercase leading-tight">
                {featured.homeName} VS {featured.awayName}
              </h3>

              <div className="mt-2 sm:mt-4 flex justify-center">
                <div className="w-16 sm:w-20 lg:w-24 h-2 sm:h-3 bg-white">
                  <div className="h-full w-1/2 bg-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Schedule Card */}
          <div className="w-full lg:max-w-[450px] bg-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">

            <div className="bg-purple-700 h-[50px] sm:h-[60px] lg:h-[70px] flex items-center justify-center">
              <h3 className="text-white text-base sm:text-xl lg:text-[28px] font-extrabold uppercase">
                Next Match
              </h3>
            </div>

            <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">

              {fixtures.map((match) => {
                const matchDate = new Date(match.dateISO);
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10 last:mb-0"
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2 w-[70px] sm:w-[80px]">
                      <div className="relative w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] lg:w-[60px] lg:h-[60px]">
                        <Image
                          src={match.homeBadge}
                          alt={match.homeName}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight">
                        {match.homeName}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-0.5 sm:gap-1 shrink-0">
                      <span className="text-base sm:text-xl lg:text-[28px] font-bold text-gray-500">
                        VS
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                        {matchDate.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {matchDate.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 sm:gap-2 w-[70px] sm:w-[80px]">
                      <div className="relative w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] lg:w-[60px] lg:h-[60px]">
                        <Image
                          src={match.awayBadge}
                          alt={match.awayName}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight">
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