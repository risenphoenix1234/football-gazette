"use client";

import { useEffect, useState } from "react";

function getTimeLeft(targetISO: string) {
  const diff = new Date(targetISO).getTime() - Date.now();
  const clamped = Math.max(diff, 0);

  return {
    hrs: String(Math.floor(clamped / 3_600_000)).padStart(2, "0"),
    min: String(Math.floor((clamped / 60_000) % 60)).padStart(2, "0"),
    sec: String(Math.floor((clamped / 1_000) % 60)).padStart(2, "0"),
  };
}

const PLACEHOLDER = { hrs: "00", min: "00", sec: "00" };

export default function Countdown({ targetISO }: { targetISO: string }) {
  const [time, setTime] = useState(PLACEHOLDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(targetISO));

    const id = setInterval(() => setTime(getTimeLeft(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return (
    <div className="grid grid-cols-3 text-center mt-14">
      <div>
        <div className="text-[56px] font-bold leading-none text-gray-600">
          {mounted ? time.hrs : "00"}
        </div>
        <div className="text-[20px] text-gray-500">Hrs</div>
      </div>

      <div>
        <div className="text-[56px] font-bold leading-none text-gray-600">
          {mounted ? time.min : "00"}
        </div>
        <div className="text-[20px] text-gray-500">Min</div>
      </div>

      <div>
        <div className="text-[56px] font-bold leading-none text-gray-600">
          {mounted ? time.sec : "00"}
        </div>
        <div className="text-[20px] text-gray-500">Sec</div>
      </div>
    </div>
  );
}
