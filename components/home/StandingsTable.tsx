"use client";

import { useState } from "react";
import Image from "next/image";
import type { StandingRow } from "@/lib/football-data";

function rowColor(position: number) {
  if (position <= 4) return "bg-purple-100"; // Champions League spots
  if (position >= 18) return "bg-red-200"; // Relegation zone
  return "";
}

export default function StandingsTable({ standings }: { standings: StandingRow[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? standings : standings.slice(0, 8);

  return (
    <div className="bg-transparent text-black">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-3 text-left text-2xl">Club</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((team) => (
            <tr key={team.position} className={`border-b border-black ${rowColor(team.position)}`}>
              <td className="py-4 pl-3 font-bold text-xl text-black flex items-center gap-2">
                {team.crest && (
                  <Image src={team.crest} alt={team.club} width={24} height={24} unoptimized />
                )}
                {team.club}
              </td>
              <td>{team.mp}</td>
              <td>{team.w}</td>
              <td>{team.d}</td>
              <td>{team.l}</td>
              <td>{team.gf}</td>
              <td>{team.ga}</td>
              <td>{team.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {standings.length > 8 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-6 rounded-full bg-purple-600 px-6 py-2 font-bold text-white transition hover:bg-purple-700"
        >
          {showAll ? "Show top 8" : "View full table"}
        </button>
      )}
    </div>
  );
}