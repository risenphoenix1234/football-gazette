// app/Fantasy-premier-league/page.tsx

import { getLeagueStandings, getManagerOfTheMonth, getPastManagersOfTheMonth } from "@/lib/fpl";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/FooterBar";
import StandingsList from "@/components/home/StandingsList";

import TopPlayersTable from "@/components/fpl/TopPlayersTable";
import FixtureDifficultyCalendar from "@/components/fpl/FixtureDifficultyCalendar";

import ManagerOfTheMonth from "@/components/fpl/ManagerOfTheMonth";
import PastManagersOfTheMonth from "@/components/fpl/PastManagersOfTheMonth";

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

  const motm = hasStarted
    ? await getManagerOfTheMonth(entries).catch((err) => {
        console.error("StandingsPage: failed to load manager of the month", err);
        return null;
      })
    : null;

  const pastMonths = hasStarted
    ? await getPastManagersOfTheMonth(entries).catch((err) => {
        console.error("StandingsPage: failed to load past managers of the month", err);
        return [];
      })
    : [];

  // Every manager tied at the top isn't a meaningful "winner" yet — it just
  // means only a partial/early gameweek has counted. Only show the current
  // month's card once fewer than the full league is tied for first.
  const showCurrentMonth =
    !!motm && motm.winners.length > 0 && motm.winners.length < entries.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf7f2] bg-[radial-gradient(circle,_rgba(88,28,135,0.18)_2px,_transparent_2px)] bg-[length:24px_24px]">
        {/* Hero banner */}
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 pt-28 pb-14 sm:pt-16 sm:py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-orange-300 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
              Fantasy Premier League
            </p>
            <h1 className="mt-3 text-[28px] leading-tight sm:text-[52px] font-black uppercase text-white break-words">
              {leagueName}
            </h1>
            <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white">
                League ID: 690578
              </span>
              {entries.length > 0 && (
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white">
                  {entries.length} managers
                </span>
              )}
              {!hasStarted && (
                <span className="rounded-full bg-orange-400/90 px-3 py-1.5 text-xs sm:text-sm font-bold text-purple-950">
                  Pre-season
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Standings */}
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            {!hasStarted && (
              <div className="mb-8 rounded-2xl border border-purple-200 bg-purple-50 px-4 sm:px-6 py-5 text-center">
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
              {/* Column headers */}
              <div className="grid grid-cols-[36px_1fr_54px_60px] sm:grid-cols-[56px_1fr_90px_90px] items-center gap-2 sm:gap-4 bg-purple-950 px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white/70">
                <span>Rank</span>
                <span>Team</span>
                <span className="text-right">GW Pts</span>
                <span className="text-right">Total</span>
              </div>

              <StandingsList entries={entries} />
            </div>
          </div>
        </section>

        {showCurrentMonth && <ManagerOfTheMonth data={motm} />}
        <PastManagersOfTheMonth months={pastMonths} />
      </main>
      <TopPlayersTable />
      <FixtureDifficultyCalendar />
      <Footer />
    </>
  );
}