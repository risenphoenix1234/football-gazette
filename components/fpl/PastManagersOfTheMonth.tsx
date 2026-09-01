import type { ManagerOfMonthResult } from "@/lib/fpl";

export default function PastManagersOfTheMonth({
  months,
}: {
  months: ManagerOfMonthResult[];
}) {
  if (months.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-xl font-black uppercase text-purple-950 sm:text-2xl">
          Past Months
        </h2>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {months.map((m) => {
            const isTie = m.winners.length > 1;
            return (
              <div
                key={m.monthKey}
                className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex items-center gap-2 sm:w-40 sm:shrink-0">
                  <span className="text-sm font-bold text-purple-950 sm:text-base">
                    {m.monthLabel}
                  </span>
                  {isTie && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                      {m.winners.length}-way tie
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-1">
                  {m.winners.map((w) => (
                    <div key={w.entryId} className="flex items-center gap-2">
                      <span className="text-yellow-500">🏆</span>
                      <span className="text-sm font-bold text-black sm:text-base">
                        {w.managerName}
                      </span>
                      <span className="text-xs text-gray-500 sm:text-sm">
                        ({w.teamName})
                      </span>
                    </div>
                  ))}
                </div>

                <span className="shrink-0 text-sm font-black text-purple-800 sm:text-base">
                  {m.winners[0].monthPoints} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}