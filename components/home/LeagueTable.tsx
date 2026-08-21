import { getStandings, getTopScorers } from "@/lib/football-data";
import StandingsTable from "./StandingsTable";

export default async function LeagueTable() {
  const [standings, scorers] = await Promise.all([
    getStandings().catch(() => []),
    getTopScorers(2).catch(() => []),
  ]);

  return (
    <section className="bg-[#f5f5f5] py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-black">
            League Table
          </h2>
          <p className="text-gray-500 font-semibold text-sm sm:text-base">
            Click for more updates
          </p>
        </div>

        <div className="grid lg:grid-cols-[520px_1fr] gap-8 lg:gap-10">
          {standings.length === 0 ? (
            <p className="text-gray-500 italic py-6 sm:py-10 text-sm sm:text-base">
              The 2026/27 Premier League season hasn&apos;t started yet — the table will
              appear here once matches begin (kickoff: 22 August 2026).
            </p>
          ) : (
            <StandingsTable standings={standings} />
          )}

          {/* SCORERS */}
          <div className="overflow-x-auto text-black -mx-4 px-4 sm:mx-0 sm:px-0">
            {scorers.length === 0 ? (
              <p className="text-gray-500 italic py-6 sm:py-10 text-sm sm:text-base">
                Top scorers will appear here once the season kicks off.
              </p>
            ) : (
              <div className="flex gap-4 sm:gap-6 lg:gap-10 min-w-max sm:min-w-0 sm:flex-wrap lg:flex-nowrap">
                {scorers.map((player) => (
                  <div
                    key={player.id}
                    className="w-[260px] sm:w-[300px] lg:w-[560px] bg-white shadow-xl shrink-0"
                  >
                    <div className="relative flex h-[160px] sm:h-[200px] lg:h-[320px] items-center justify-center bg-purple-700 text-white">
                      <span className="text-4xl sm:text-5xl lg:text-8xl font-black">
                        {player.name.charAt(0)}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 lg:p-6">
                      <h3 className="text-center text-base sm:text-xl lg:text-4xl font-black uppercase text-purple-700 mb-3 sm:mb-4 lg:mb-6">
                        {player.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-y-1 sm:gap-y-1.5 lg:gap-y-2 text-xs sm:text-sm lg:text-2xl">
                        <span>GOALS:</span>
                        <span className="text-right">{player.goals}</span>
                        <span>ASSIST:</span>
                        <span className="text-right">{player.assists ?? "—"}</span>
                        <span>COUNTRY:</span>
                        <span className="text-right">{player.nationality}</span>
                        <span>POSITION:</span>
                        <span className="text-right">{player.position ?? "—"}</span>
                        <span>CLUB:</span>
                        <span className="text-right">{player.club}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}