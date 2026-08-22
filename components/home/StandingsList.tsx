"use client";

import { useState } from "react";

interface Entry {
  id: number | string;
  entryId: number;
  teamName: string;
  managerName: string;
  gwPoints: number;
  totalPoints: number;
}

function RankBadge({ rank }: { rank: number }) {
  const medal =
    rank === 1
      ? "bg-[#f5c542] text-purple-950"
      : rank === 2
      ? "bg-[#d6d6de] text-purple-950"
      : rank === 3
      ? "bg-[#c58a4b] text-white"
      : "bg-purple-100 text-purple-800";

  return (
    <div
      className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full font-black text-xs sm:text-sm ${medal}`}
    >
      {rank}
    </div>
  );
}

export default function StandingsList({
  entries,
}: {
  entries: (Entry & { rank: number })[];
}) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 15;

  const visible = showAll ? entries : entries.slice(0, INITIAL_COUNT);
  const hasMore = entries.length > INITIAL_COUNT;

  return (
    <>
      <ul className="divide-y divide-gray-100">
        {entries.length === 0 && (
          <li className="px-4 sm:px-6 py-16 text-center">
            <p className="font-bold text-slate-700">No standings data yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Check back after Gameweek 1 — your 50 registered managers will
              show up here once FPL publishes results.
            </p>
          </li>
        )}
        {visible.map((entry) => (
          <li
            key={entry.entryId}
            className="grid grid-cols-[36px_1fr_54px_60px] sm:grid-cols-[56px_1fr_90px_90px] items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4"
          >
            <RankBadge rank={entry.rank} />

            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900 text-sm sm:text-base">
                {entry.teamName}
              </p>
              <p className="truncate text-xs sm:text-sm text-slate-500">
                {entry.managerName}
              </p>
            </div>

            <span className="text-right font-semibold text-slate-700 tabular-nums text-sm sm:text-base">
              {entry.gwPoints}
            </span>
            <span className="text-right font-black text-purple-900 tabular-nums text-sm sm:text-base">
              {entry.totalPoints}
            </span>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="border-t border-gray-100 px-4 sm:px-6 py-4 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-1 text-sm font-bold text-purple-800 hover:text-purple-950 transition-colors"
          >
            {showAll ? "Show less" : `View more (${entries.length - INITIAL_COUNT} more)`}
            <svg
              className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}