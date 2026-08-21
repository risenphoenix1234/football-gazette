const API_KEY = process.env.API_FOOTBALL_KEY!;
const BASE_URL = "[v3.football.api-sports.io](https://v3.football.api-sports.io)";

async function api(path: string, params: Record<string, string>) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": API_KEY },
  });

  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  return json.response;
}

export async function fetchPremierLeagueFixtures() {
  return api("/fixtures", {
    league: "39",
    season: "2024",
    next: "10",
  });
}

export async function fetchPremierLeagueStandings() {
  const res = await api("/standings", {
    league: "39",
    season: "2024",
  });
  return res[0].league.standings[0];
}
