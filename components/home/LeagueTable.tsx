import { getStandings, getTopScorers } from "@/lib/football-data";
import StandingsTable from "./StandingsTable";

export default async function LeagueTable() {
  const [standings, scorers] = await Promise.all([
    getStandings().catch(() => []),
    getTopScorers(5).catch(() => []),
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

        <div className="grid gap-8 lg:grid-cols-[520px_1fr] lg:gap-10">
          {standings.length === 0 ? (
            <p className="text-gray-500 italic py-6 sm:py-10 text-sm sm:text-base">
              The 2026/27 Premier League season hasn&apos;t started yet — the table will
              appear here once matches begin (kickoff: 22 August 2026).
            </p>
          ) : (
            <StandingsTable standings={standings} />
          )}

          {/* SCORERS */}
          <div className="text-black">
            <h3 className="mb-4 text-lg font-black uppercase sm:text-xl">
              Top Scorers
            </h3>

            {scorers.length === 0 ? (
              <p className="text-gray-500 italic py-6 sm:py-10 text-sm sm:text-base">
                Top scorers will appear here once the season kicks off.
              </p>
            ) : (
              <div className="divide-y divide-gray-200 bg-white shadow-xl">
                {scorers.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
                  >
                    {/* Rank */}
                    <span className="w-5 shrink-0 text-sm font-black text-gray-400 sm:w-6 sm:text-base">
                      {index + 1}
                    </span>

                    {/* Name + meta */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black uppercase text-purple-700 sm:text-base">
                        {player.name}
                      </p>
                      <p className="truncate text-xs text-gray-500 sm:text-sm">
                        {player.club} · {player.nationality}
                        {player.position ? ` · ${player.position}` : ""}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex shrink-0 items-center gap-4 text-right sm:gap-6">
                      <div>
                        <p className="text-xs text-gray-400 sm:text-sm">Goals</p>
                        <p className="text-sm font-black sm:text-base">{player.goals}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 sm:text-sm">Assists</p>
                        <p className="text-sm font-black sm:text-base">
                          {player.assists ?? "—"}
                        </p>
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