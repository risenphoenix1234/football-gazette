// components/fpl/ManagerOfTheMonth.tsx

import type { ManagerOfMonthResult } from "@/lib/fpl";

export default function ManagerOfTheMonth({ data }: { data: ManagerOfMonthResult }) {
  const { monthLabel, winners, leaderboard } = data;

  if (winners.length === 0) {
    return (
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-xl font-black uppercase text-purple-950 sm:text-2xl">
            Manager of the Month
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            No gameweeks have completed yet this month — check back once a
            gameweek locks in.
          </p>
        </div>
      </section>
    );
  }

  const winnerIds = new Set(winners.map((w) => w.entryId));
  const runnersUp = leaderboard.filter((m) => !winnerIds.has(m.entryId)).slice(0, 4);
  const isTie = winners.length > 1;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-xl font-black uppercase text-purple-950 sm:text-2xl">
          Manager of the Month
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500 sm:text-base">
          {monthLabel}
          {isTie && (
            <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-orange-700">
              {winners.length}-way tie
            </span>
          )}
        </p>

        {/* Winner card(s) — one block per tied winner */}
        <div
          className={`mt-6 grid gap-4 ${
            winners.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {winners.map((winner) => (
            <div
              key={winner.entryId}
              className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 px-6 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] sm:flex-row sm:justify-between sm:text-left"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300 sm:text-sm">
                  🏆 Winner
                </p>
                <h3 className="mt-1 text-2xl font-black uppercase text-white sm:text-3xl">
                  {winner.managerName}
                </h3>
                <p className="mt-1 text-sm text-white/70 sm:text-base">
                  {winner.teamName}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-6 py-4">
                <p className="text-3xl font-black text-white sm:text-4xl">
                  {winner.monthPoints}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60 sm:text-sm">
                  points
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Runners-up */}
        {runnersUp.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            {runnersUp.map((m, i) => (
              <div
                key={m.entryId}
                className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:px-6 sm:py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-5 shrink-0 text-sm font-black text-gray-400 sm:text-base">
                    {winners.length + i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-purple-950 sm:text-base">
                      {m.managerName}
                    </p>
                    <p className="truncate text-xs text-gray-500 sm:text-sm">
                      {m.teamName}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-black text-purple-800 sm:text-base">
                  {m.monthPoints} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}