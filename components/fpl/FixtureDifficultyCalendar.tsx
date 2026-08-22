import { getFixtureDifficulty } from "@/lib/fpl";

const difficultyColor: Record<number, string> = {
  1: "bg-emerald-500",
  2: "bg-emerald-300",
  3: "bg-amber-300",
  4: "bg-rose-300",
  5: "bg-rose-500",
};

export default async function FixtureDifficultyCalendar() {
  const rows = await getFixtureDifficulty(5);
  const gwLabels = rows[0]?.gameweeks.length
    ? Array.from(new Set(rows.flatMap((r) => r.gameweeks.map((g) => g.event)))).sort((a, b) => a - b)
    : [];

  return (
    <section className="bg-[#faf7f2] py-14">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-black uppercase text-purple-950 mb-2">Fixture Difficulty</h2>
        <p className="text-slate-500 mb-8">Next 5 gameweeks, colour-coded from easiest (green) to hardest (red).</p>

        <div
          className="relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/61135/pexels-photo-61135.jpeg?auto=compress&w=1260&h=750&dpr=1')",
          }}
        >
          {/* Overlay so the whole card stays readable over the photo */}
          <div className="absolute inset-0 bg-white/90" />

          <div className="relative">
            {/* Header band — slightly darker overlay so it reads as a header */}
            <div className="relative px-4 py-6 sm:py-7">
              <div className="absolute inset-0 bg-purple-950/70" />
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white text-xs uppercase tracking-wide">
                      <th className="px-4 text-left font-bold whitespace-nowrap drop-shadow-md">Team</th>
                      {gwLabels.map((gw) => (
                        <th key={gw} className="px-3 text-center font-bold whitespace-nowrap drop-shadow-md">
                          GW{gw}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            {/* Body table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200/70">
                  {rows.map((row) => (
                    <tr key={row.teamId}>
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{row.teamName}</td>
                      {gwLabels.map((gw) => {
                        const fixture = row.gameweeks.find((g) => g.event === gw);
                        return (
                          <td key={gw} className="px-3 py-3 text-center">
                            {fixture ? (
                              <span
                                className={`inline-flex min-w-[52px] justify-center rounded-md px-2 py-1 text-xs font-bold text-purple-950 ${difficultyColor[fixture.difficulty]}`}
                              >
                                {fixture.opponent}
                                {fixture.isHome ? "" : " (A)"}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 px-5 py-4">
          <p className="text-sm font-bold text-purple-900">💡 Tip</p>
          <p className="text-sm text-purple-700 mt-1">
            A green run of 3+ fixtures is the classic signal to bring in players from that team — especially
            defenders, since clean-sheet potential rises against weaker attacks. Plan transfers 1–2 gameweeks
            ahead of the run starting, not after it&apos;s already begun.
          </p>
        </div>
      </div>
    </section>
  );
}