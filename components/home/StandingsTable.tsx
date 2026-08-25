"use client";

import { useState } from "react";
import type { StandingRow } from "@/lib/football-data";

// Colored bar to mark competition zones instead of a crest/logo
function zoneColor(position: number) {
  if (position <= 4) return "bg-emerald-500"; // Champions League
  if (position === 5) return "bg-blue-500"; // Europa League
  if (position >= 18) return "bg-red-500"; // Relegation
  return "bg-transparent";
}

function rowTint(position: number) {
  if (position <= 4) return "bg-purple-50";
  if (position >= 18) return "bg-red-50";
  return "";
}

export default function StandingsTable({ standings }: { standings: StandingRow[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? standings : standings.slice(0, 8);

  return (
    <div className="bg-transparent text-black">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[340px] border-collapse text-sm sm:text-base">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 pl-2 text-left text-base font-black sm:py-3 sm:pl-3 sm:text-xl">
                Club
              </th>
              <th className="px-1 text-xs font-bold sm:text-sm">P</th>
              <th className="px-1 text-xs font-bold sm:text-sm">W</th>
              <th className="px-1 text-xs font-bold sm:text-sm">D</th>
              <th className="px-1 text-xs font-bold sm:text-sm">L</th>
              <th className="hidden px-1 text-xs font-bold md:table-cell md:text-sm">GF</th>
              <th className="hidden px-1 text-xs font-bold md:table-cell md:text-sm">GA</th>
              <th className="px-1 text-xs font-black sm:text-sm">Pts</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((team) => (
              <tr
                key={team.club}
                className={`border-b border-black ${rowTint(team.position)}`}
              >
                <td className="py-2 pl-0 sm:py-4 sm:pl-3">
                  <div className="flex items-stretch gap-2">
                    <span className={`w-1 shrink-0 rounded-full ${zoneColor(team.position)}`} />
                    <span className="truncate text-sm font-bold sm:text-xl">
                      {team.position}. {team.club}
                    </span>
                  </div>
                </td>
                <td className="px-1 text-center">{team.mp}</td>
                <td className="px-1 text-center">{team.w}</td>
                <td className="px-1 text-center">{team.d}</td>
                <td className="px-1 text-center">{team.l}</td>
                <td className="hidden px-1 text-center md:table-cell">{team.gf}</td>
                <td className="hidden px-1 text-center md:table-cell">{team.ga}</td>
                <td className="px-1 text-center font-black">{team.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {standings.length > 8 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 rounded-full bg-purple-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-purple-700 sm:mt-6 sm:px-6 sm:text-base"
        >
          {showAll ? "Show top 8" : "View full table"}
        </button>
      )}
    </div>
  );
}