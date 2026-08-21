// lib/football-data.ts
// Free tier — requires a free API key from https://www.football-data.org/client/register
// Set FOOTBALL_DATA_TOKEN in .env.local. Free tier: 10 requests/min, Premier League included.

const BASE = "https://api.football-data.org/v4";
const PL_CODE = "PL"; // Premier League competition code

export type Fixture = {
  id: number;
  homeName: string;
  homeBadge: string;
  awayName: string;
  awayBadge: string;
  dateISO: string;
  venue: string | null;
};

type RawTeam = {
  name: string;
  shortName: string;
  crest: string | null;
};

type RawMatch = {
  id: number;
  utcDate: string;
  venue: string | null;
  homeTeam: RawTeam;
  awayTeam: RawTeam;
};

const FALLBACK_BADGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="28" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>
      <text x="30" y="38" font-size="24" text-anchor="middle" fill="#6b7280" font-family="sans-serif">?</text>
    </svg>`
  );

export async function getUpcomingEPLFixtures(limit = 5): Promise<Fixture[]> {
  console.log(`[football-data] fetching fresh at ${new Date().toISOString()}`);

  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    throw new Error(
      "Missing FOOTBALL_DATA_TOKEN — add it to .env.local (get a free key at football-data.org/client/register)"
    );
  }

  const res = await fetch(
    `${BASE}/competitions/${PL_CODE}/matches?status=SCHEDULED`,
    {
      headers: { "X-Auth-Token": token },
      cache: "no-store", // fully dynamic — refetches on every request
    }
  );

  if (!res.ok) {
    throw new Error(`football-data.org request failed: ${res.status}`);
  }

  // football-data.org asks clients to watch this header to avoid tripping their limiter.
  const remaining = res.headers.get("X-Requests-Available-Minute");
  if (remaining !== null && Number(remaining) <= 2) {
    console.warn(
      `football-data.org: only ${remaining} requests left this minute — consider raising the revalidate cache time`
    );
  }

  const data: { matches: RawMatch[] } = await res.json();

  // matches come back sorted by date ascending already, but sort defensively
  const sorted = [...data.matches].sort(
    (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
  );

  return sorted.slice(0, limit).map((m) => ({
    id: m.id,
    homeName: m.homeTeam.shortName || m.homeTeam.name,
    homeBadge: m.homeTeam.crest || FALLBACK_BADGE,
    awayName: m.awayTeam.shortName || m.awayTeam.name,
    awayBadge: m.awayTeam.crest || FALLBACK_BADGE,
    dateISO: m.utcDate,
    venue: m.venue,
  }));
}


export type StandingRow = {
  position: number;
  club: string;
  crest: string | null;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
};

export async function getStandings(): Promise<StandingRow[]> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) throw new Error("Missing FOOTBALL_DATA_TOKEN");

  const res = await fetch(`${BASE}/competitions/PL/standings`, {
    headers: { "X-Auth-Token": token },
    next: { revalidate: 3600 }, // standings don't change every minute — cache 1 hr
  });

  if (!res.ok) throw new Error(`Standings request failed: ${res.status}`);
  const data = await res.json();

  const table = data.standings.find((s: any) => s.type === "TOTAL")?.table ?? [];

  return table.map((row: any): StandingRow => ({
    position: row.position,
    club: row.team.shortName || row.team.name,
    crest: row.team.crest || null,
    mp: row.playedGames,
    w: row.won,
    d: row.draw,
    l: row.lost,
    gf: row.goalsFor,
    ga: row.goalsAgainst,
    pts: row.points,
  }));
}

export type TopScorer = {
  id: number;
  name: string;
  photo: string | null;
  club: string;
  goals: number;
  assists: number | null;
  nationality: string;
  position: string | null;
};

export async function getTopScorers(limit = 5): Promise<TopScorer[]> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) throw new Error("Missing FOOTBALL_DATA_TOKEN");

  const res = await fetch(`${BASE}/competitions/PL/scorers?limit=${limit}`, {
    headers: { "X-Auth-Token": token },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Scorers request failed: ${res.status}`);
  const data = await res.json();

  return (data.scorers ?? []).map((s: any): TopScorer => ({
    id: s.player.id,
    name: s.player.name,
    photo: null, // free tier doesn't include player photos
    club: s.team.shortName || s.team.name,
    goals: s.goals,
    assists: s.assists ?? null,
    nationality: s.player.nationality,
    position: s.player.position || null,
  }));
}