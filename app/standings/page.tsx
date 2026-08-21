// app/standings/page.tsx

import { getLeagueStandings } from "@/lib/fpl";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/FooterBar";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function RankBadge({ rank }: { rank: number }) {
  const medal =
    rank === 1
      ? "bg-[#f5c542] text-purple-950"
      : rank === 2
      ? "bg-[#d6d6de] text-purple-950"
      : rank === 3
      ? "bg-[#c58a4b] text-white"
      : "bg-purple-100 text-purple-800";

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-sm ${medal}`}
    >
      {rank}
    </div>
  );
}

function MovementChip({
  movement,
}: {
  movement: "up" | "down" | "same" | "new";
}) {
  const map = {
    up: { label: "▲", cls: "bg-emerald-100 text-emerald-700" },
    down: { label: "▼", cls: "bg-rose-100 text-rose-700" },
    same: { label: "–", cls: "bg-gray-100 text-gray-500" },
    new: { label: "NEW", cls: "bg-purple-100 text-purple-700" },
  } as const;

  const m = map[movement];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-bold tabular-nums ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

export default async function StandingsPage() {
  let data: Awaited<ReturnType<typeof getLeagueStandings>> | null = null;
  let errored = false;

  try {
    data = await getLeagueStandings();
  } catch (err) {
    console.error("StandingsPage: failed to load FPL standings", err);
    errored = true;
  }

  if (errored || !data) {
    return (
      <>
        <Navbar />
        <section className="bg-[#faf7f2] py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-3xl font-black uppercase text-purple-950">
              Standings unavailable
            </h1>
            <p className="mt-3 text-slate-500">
              Couldn&apos;t reach the FPL servers just now — try again shortly.
            </p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const { leagueName, entries, hasStarted } = data;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf7f2]">
      {/* Hero banner */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-orange-300 text-sm font-bold uppercase tracking-[0.2em]">
            Fantasy Premier League
          </p>
          <h1 className="mt-3 text-[40px] leading-tight sm:text-[52px] font-black uppercase text-white">
            {leagueName}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
              League ID: 690578
            </span>
            {entries.length > 0 && (
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                {entries.length} managers
              </span>
            )}
            {!hasStarted && (
              <span className="rounded-full bg-orange-400/90 px-4 py-1.5 text-sm font-bold text-purple-950">
                Pre-season
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Standings */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-6">
          {!hasStarted && (
            <div className="mb-8 rounded-2xl border border-purple-200 bg-purple-50 px-6 py-5 text-center">
              <p className="font-bold text-purple-900">
                Standings aren&apos;t live yet.
              </p>
              <p className="mt-1 text-sm text-purple-700">
                FPL computes classic-league standings once the season&apos;s
                first gameweek locks in — your registered managers will
                appear here automatically the moment that happens.
              </p>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            {/* Column headers — hidden on mobile, table collapses to cards */}
            <div className="hidden sm:grid grid-cols-[56px_1fr_90px_90px_70px] items-center gap-4 bg-purple-950 px-6 py-4 text-xs font-bold uppercase tracking-wide text-white/70">
              <span>Rank</span>
              <span>Team</span>
              <span className="text-right">GW Pts</span>
              <span className="text-right">Total</span>
              <span className="text-right">Move</span>
            </div>

            <ul className="divide-y divide-gray-100">
              {entries.length === 0 && (
                <li className="px-6 py-16 text-center">
                  <p className="font-bold text-slate-700">
                    No standings data yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Check back after Gameweek 1 — your 50 registered
                    managers will show up here once FPL publishes results.
                  </p>
                </li>
              )}
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="grid grid-cols-[56px_1fr] sm:grid-cols-[56px_1fr_90px_90px_70px] items-center gap-4 px-6 py-4"
                >
                  <RankBadge rank={entry.rank} />

                  <div className="min-w-0 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-700 text-xs font-bold text-white">
                      {initials(entry.managerName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {entry.teamName}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {entry.managerName}
                      </p>
                    </div>
                  </div>

                  {/* Desktop columns */}
                  <span className="hidden sm:block text-right font-semibold text-slate-700 tabular-nums">
                    {entry.gwPoints}
                  </span>
                  <span className="hidden sm:block text-right font-black text-purple-900 tabular-nums">
                    {entry.totalPoints}
                  </span>
                  <span className="hidden sm:flex justify-end">
                    <MovementChip movement={entry.movement} />
                  </span>

                  {/* Mobile: stack points + movement under the name row */}
                  <div className="col-span-2 sm:hidden flex items-center justify-between pl-12 mt-1">
                    <span className="text-sm text-slate-500">
                      GW {entry.gwPoints} · Total{" "}
                      <strong className="text-purple-900">
                        {entry.totalPoints}
                      </strong>
                    </span>
                    <MovementChip movement={entry.movement} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}