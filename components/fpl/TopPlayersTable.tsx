import { getTopPlayers, getTopByPoints, getTopByTransfersIn, getBestValue } from "@/lib/fpl";

export default async function TopPlayersTable() {
  const players = await getTopPlayers();
  const byPoints = getTopByPoints(players, 5);
  const byTransfers = getTopByTransfersIn(players, 5);
  const byValue = getBestValue(players, 5);

  const Table = ({
    title,
    rows,
    metricLabel,
    metric,
  }: {
    title: string;
    rows: typeof players;
    metricLabel: string;
    metric: (p: (typeof players)[number]) => string | number;
  }) => (
    <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="bg-purple-950 px-6 py-4">
        <h3 className="text-white font-black uppercase text-sm tracking-wide">{title}</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {rows.map((p, i) => (
          <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-bold text-purple-400 w-4 shrink-0">{i + 1}</span>
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900 text-sm">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {p.team} · {p.position} · £{p.price}m
                </p>
              </div>
            </div>
            <span className="shrink-0 font-black text-purple-900 tabular-nums text-sm">
              {metric(p)} <span className="font-medium text-slate-400 text-xs">{metricLabel}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="py-14 bg-[#faf7f2]">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-black uppercase text-purple-950 mb-2">Top Players</h2>
        <p className="text-slate-500 mb-8">
          Who&apos;s delivering the points, who everyone&apos;s bringing in, and who gives you the most bang for your budget.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Table title="Highest Points" rows={byPoints} metricLabel="pts" metric={(p) => p.totalPoints} />
          <Table title="Most Transferred In" rows={byTransfers} metricLabel="in" metric={(p) => p.transfersInEvent.toLocaleString()} />
          <Table title="Best Value" rows={byValue} metricLabel="pts/£m" metric={(p) => p.pointsPerMillion} />
        </div>

        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 px-5 py-4">
          <p className="text-sm font-bold text-purple-900">💡 Tip</p>
          <p className="text-sm text-purple-700 mt-1">
            Don&apos;t chase points alone — a player racking up transfers-in is often a sign of an easy upcoming
            fixture run, not just recent form. Cross-check with the fixture calendar below before you spend your budget.
          </p>
        </div>
      </div>
    </section>
  );
}