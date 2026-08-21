import { getStandings, getTopScorers } from "@/lib/football-data";
import StandingsTable from "./StandingsTable";

export default async function LeagueTable() {
  const [standings, scorers] = await Promise.all([
    getStandings().catch(() => []),
    getTopScorers(2).catch(() => []),
  ]);

  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14">
          <h2 className="text-5xl font-black uppercase text-black">League Table</h2>
          <p className="text-gray-500 font-semibold">Click for more updates</p>
        </div>

        <div className="grid lg:grid-cols-[520px_1fr] gap-10">
          {standings.length === 0 ? (
            <p className="text-gray-500 italic py-10">
              The 2026/27 Premier League season hasn't started yet — the table will
              appear here once matches begin (kickoff: 22 August 2026).
            </p>
          ) : (
            <StandingsTable standings={standings} />
          )}

          {/* SCORERS */}
          <div className="overflow-x-auto text-black">
            {scorers.length === 0 ? (
              <p className="text-gray-500 italic py-10">
                Top scorers will appear here once the season kicks off.
              </p>
            ) : (
              <div className="flex gap-10 min-w-max">
                {scorers.map((player) => (
                  <div key={player.id} className="w-[560px] bg-white shadow-xl">
                    <div className="relative flex h-[320px] items-center justify-center bg-purple-700 text-white">
                      <span className="text-8xl font-black">
                        {player.name.charAt(0)}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-center text-4xl font-black uppercase text-purple-700 mb-6">
                        {player.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-y-2 text-2xl">
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