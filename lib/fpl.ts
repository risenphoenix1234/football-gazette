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

  // Defensive dedupe: FPL pagination can occasionally return overlapping
  // results if has_next is stale or a page is re-fetched.
  const seen = new Set<number>();
  const uniqueResults = allResults.filter((r) => {
    if (seen.has(r.entry)) return false;
    seen.add(r.entry);
    return true;
  });

  const entries: StandingsEntry[] = uniqueResults.map((r) => ({
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

// --- Top Players ---
export interface TopPlayer {
  id: number;
  name: string;
  team: string;
  position: string;
  totalPoints: number;
  price: number;
  transfersInEvent: number;
  pointsPerMillion: number;
}

export async function getTopPlayers(): Promise<TopPlayer[]> {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch FPL bootstrap data");

  const data = await res.json();
  const teams: Record<number, string> = Object.fromEntries(
    data.teams.map((t: any) => [t.id, t.short_name])
  );
  const positions: Record<number, string> = {
    1: "GKP",
    2: "DEF",
    3: "MID",
    4: "FWD",
  };

  const players: TopPlayer[] = data.elements.map((p: any) => {
    const price = p.now_cost / 10;
    return {
      id: p.id,
      name: `${p.first_name} ${p.second_name}`,
      team: teams[p.team] ?? "",
      position: positions[p.element_type] ?? "",
      totalPoints: p.total_points,
      price,
      transfersInEvent: p.transfers_in_event,
      pointsPerMillion: price > 0 ? Math.round((p.total_points / price) * 10) / 10 : 0,
    };
  });

  return players;
}

export function getTopByPoints(players: TopPlayer[], limit = 10) {
  return [...players].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, limit);
}

export function getTopByTransfersIn(players: TopPlayer[], limit = 10) {
  return [...players].sort((a, b) => b.transfersInEvent - a.transfersInEvent).slice(0, limit);
}

export function getBestValue(players: TopPlayer[], limit = 10) {
  return [...players]
    .filter((p) => p.totalPoints >= 20) // filters out noise from unused players
    .sort((a, b) => b.pointsPerMillion - a.pointsPerMillion)
    .slice(0, limit);
}

// --- Fixture Difficulty ---
export interface FixtureDifficultyRow {
  teamId: number;
  teamName: string;
  gameweeks: { event: number; opponent: string; isHome: boolean; difficulty: number }[];
}

export async function getFixtureDifficulty(gwCount = 5): Promise<FixtureDifficultyRow[]> {
  const [bootstrapRes, fixturesRes] = await Promise.all([
    fetch("https://fantasy.premierleague.com/api/bootstrap-static/", { next: { revalidate: 3600 } }),
    fetch("https://fantasy.premierleague.com/api/fixtures/", { next: { revalidate: 3600 } }),
  ]);
  if (!bootstrapRes.ok || !fixturesRes.ok) throw new Error("Failed to fetch fixture data");

  const bootstrap = await bootstrapRes.json();
  const fixtures = await fixturesRes.json();

  const teams: Record<number, string> = Object.fromEntries(
    bootstrap.teams.map((t: any) => [t.id, t.short_name])
  );

  const currentEvent =
    bootstrap.events.find((e: any) => e.is_next)?.id ??
    bootstrap.events.find((e: any) => e.is_current)?.id ??
    1;

  const upcoming = fixtures.filter(
    (f: any) => f.event && f.event >= currentEvent && f.event < currentEvent + gwCount
  );

  const rows: Record<number, FixtureDifficultyRow> = {};
  for (const teamId of Object.keys(teams).map(Number)) {
    rows[teamId] = { teamId, teamName: teams[teamId], gameweeks: [] };
  }

  for (const f of upcoming) {
    rows[f.team_h].gameweeks.push({
      event: f.event,
      opponent: teams[f.team_a],
      isHome: true,
      difficulty: f.team_h_difficulty,
    });
    rows[f.team_a].gameweeks.push({
      event: f.event,
      opponent: teams[f.team_h],
      isHome: false,
      difficulty: f.team_a_difficulty,
    });
  }

  return Object.values(rows).sort((a, b) => a.teamName.localeCompare(b.teamName));
}
// --- Manager's current team ---
export interface SquadPlayer {
  id: number;
  name: string;
  team: string;
  position: string;
  points: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isStarting: boolean;
  multiplier: number;
}

export interface ManagerTeam {
  managerName: string;
  teamName: string;
  gameweek: number;
  totalPoints: number;
  squad: SquadPlayer[];
}

async function getCurrentGameweek(): Promise<number> {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch bootstrap data");
  const data = await res.json();
  return (
    data.events.find((e: any) => e.is_current)?.id ??
    data.events.find((e: any) => e.is_next)?.id ??
    1
  );
}

export async function getManagerTeam(entryId: number, gw?: number): Promise<ManagerTeam> {
  const gameweek = gw ?? (await getCurrentGameweek());

  const [bootstrapRes, entryRes, picksRes] = await Promise.all([
    fetch("https://fantasy.premierleague.com/api/bootstrap-static/", { next: { revalidate: 3600 } }),
    fetch(`https://fantasy.premierleague.com/api/entry/${entryId}/`, { next: { revalidate: 300 } }),
    fetch(`https://fantasy.premierleague.com/api/entry/${entryId}/event/${gameweek}/picks/`, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!bootstrapRes.ok || !entryRes.ok || !picksRes.ok) {
    throw new Error("Failed to fetch manager team");
  }

  const bootstrap = await bootstrapRes.json();
  const entry = await entryRes.json();
  const picks = await picksRes.json();

  const teams: Record<number, string> = Object.fromEntries(
    bootstrap.teams.map((t: any) => [t.id, t.short_name])
  );
  const positions: Record<number, string> = { 1: "GKP", 2: "DEF", 3: "MID", 4: "FWD" };
  const elementsById: Record<number, any> = Object.fromEntries(
    bootstrap.elements.map((e: any) => [e.id, e])
  );

  const squad: SquadPlayer[] = picks.picks.map((p: any) => {
    const el = elementsById[p.element];
    return {
      id: p.element,
      name: `${el.first_name} ${el.second_name}`,
      team: teams[el.team] ?? "",
      position: positions[el.element_type] ?? "",
      points: el.event_points ?? 0,
      isCaptain: p.is_captain,
      isViceCaptain: p.is_vice_captain,
      isStarting: p.position <= 11,
      multiplier: p.multiplier,
    };
  });

  return {
    managerName: `${entry.player_first_name} ${entry.player_last_name}`,
    teamName: entry.name,
    gameweek,
    totalPoints: picks.entry_history?.points ?? 0,
    squad,
  };
}
// --- Manager of the Month ---
export interface ManagerOfMonth {
  entryId: number;
  managerName: string;
  teamName: string;
  monthPoints: number;
  gameweeks: number[];
}

export interface ManagerOfMonthResult {
  monthKey: string;
  monthLabel: string;
  winner: ManagerOfMonth | null;
  leaderboard: ManagerOfMonth[];
}

async function getMonthGameweeks(monthKey?: string) {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch bootstrap data");
  const data = await res.json();

  const now = new Date();
  const targetMonth =
    monthKey ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const events: number[] = [];
  let monthLabel = "";

  for (const e of data.events) {
    if (!e.deadline_time) continue;
    const d = new Date(e.deadline_time);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key === targetMonth) {
      events.push(e.id);
      monthLabel = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
  }

  return { monthKey: targetMonth, monthLabel, events };
}

/**
 * Sums each manager's points across the gameweeks that fall in the given
 * calendar month (defaults to the current month) and ranks them.
 * Requires one history fetch per manager — fine for a small private league,
 * but reconsider batching/caching if the league grows to hundreds of entries.
 */
export async function getManagerOfTheMonth(
  entries: { entryId: number; managerName: string; teamName: string }[],
  monthKey?: string
): Promise<ManagerOfMonthResult> {
  const { monthKey: resolvedKey, monthLabel, events } = await getMonthGameweeks(monthKey);

  if (events.length === 0) {
    return { monthKey: resolvedKey, monthLabel, winner: null, leaderboard: [] };
  }

  const results = await Promise.all(
    entries.map(async (entry): Promise<ManagerOfMonth | null> => {
      try {
        const res = await fetch(
          `https://fantasy.premierleague.com/api/entry/${entry.entryId}/history/`,
          { next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const current: { event: number; points: number }[] = data.current ?? [];

        const monthPoints = current
          .filter((gw) => events.includes(gw.event))
          .reduce((sum, gw) => sum + gw.points, 0);

        return {
          entryId: entry.entryId,
          managerName: entry.managerName,
          teamName: entry.teamName,
          monthPoints,
          gameweeks: events,
        };
      } catch {
        return null;
      }
    })
  );

  const leaderboard = results
    .filter((r): r is ManagerOfMonth => r !== null)
    .sort((a, b) => b.monthPoints - a.monthPoints);

  return {
    monthKey: resolvedKey,
    monthLabel,
    winner: leaderboard[0] ?? null,
    leaderboard,
  };
}