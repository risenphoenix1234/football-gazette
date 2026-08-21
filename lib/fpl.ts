// lib/fpl.ts
// Public FPL API — no key required. Rate limits are informal but be a good
// citizen: this is cached for 5 min since standings don't move outside gameweeks.

const LEAGUE_ID = 690578; // Football Gazette

export type StandingsEntry = {
  id: number;
  entryId: number;
  teamName: string;
  managerName: string;
  rank: number;
  lastRank: number;
  gwPoints: number;
  totalPoints: number;
  movement: "up" | "down" | "same" | "new";
};

export type LeagueStandings = {
  leagueName: string;
  entries: StandingsEntry[];
  hasStarted: boolean; // true once at least one manager has a non-zero total
  currentGameweek: number | null;
};

type RawStandingsResponse = {
  league: { name: string };
  standings: {
    has_next: boolean;
    page: number;
    results: {
      id: number;
      entry: number;
      entry_name: string;
      player_name: string;
      rank: number;
      last_rank: number;
      event_total: number;
      total: number;
    }[];
  };
};

function movementFor(rank: number, lastRank: number): StandingsEntry["movement"] {
  if (lastRank === 0) return "new";
  if (rank < lastRank) return "up";
  if (rank > lastRank) return "down";
  return "same";
}

export async function getLeagueStandings(): Promise<LeagueStandings> {
  const allResults: RawStandingsResponse["standings"]["results"] = [];
  let page = 1;
  let leagueName = "Football Gazette";

  // FPL paginates at 50/page — loop defensively, cap at 3 pages (150 entries)
  // so a bug upstream can't send us into an infinite fetch loop.
  while (page <= 3) {
    const res = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${LEAGUE_ID}/standings/?page_standings=${page}`,
      {
        headers: {
          // FPL's API is picky without a browser-like UA on some hosts
          "User-Agent": "Mozilla/5.0 (compatible; FootballGazetteBot/1.0)",
        },
        next: { revalidate: 300 }, // 5 min cache
      }
    );

    if (!res.ok) {
      throw new Error(`FPL standings request failed: ${res.status}`);
    }

    const data: RawStandingsResponse = await res.json();
    leagueName = data.league.name;
    allResults.push(...data.standings.results);

    if (!data.standings.has_next) break;
    page += 1;
  }

  const entries: StandingsEntry[] = allResults.map((r) => ({
    id: r.id,
    entryId: r.entry,
    teamName: r.entry_name,
    managerName: r.player_name,
    rank: r.rank,
    lastRank: r.last_rank,
    gwPoints: r.event_total,
    totalPoints: r.total,
    movement: movementFor(r.rank, r.last_rank),
  }));

  const hasStarted = entries.some((e) => e.totalPoints > 0);

  return {
    leagueName,
    entries,
    hasStarted,
    currentGameweek: null,
  };
}