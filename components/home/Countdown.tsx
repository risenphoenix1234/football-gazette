"use client";

import { useEffect, useState } from "react";

function getTimeLeft(targetISO: string) {
  const diff = new Date(targetISO).getTime() - Date.now();
  const clamped = Math.max(diff, 0);

  const days = Math.floor(clamped / 86_400_000);
  const hrs = Math.floor((clamped / 3_600_000) % 24);
  const min = Math.floor((clamped / 60_000) % 60);
  const sec = Math.floor((clamped / 1_000) % 60);

  return {
    days,
    hrs: String(hrs).padStart(2, "0"),
    min: String(min).padStart(2, "0"),
    sec: String(sec).padStart(2, "0"),
  };
}

const PLACEHOLDER = { days: 0, hrs: "00", min: "00", sec: "00" };

export default function Countdown({ targetISO }: { targetISO: string }) {
  const [time, setTime] = useState(PLACEHOLDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(targetISO));

    const id = setInterval(() => setTime(getTimeLeft(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const showDays = mounted && time.days > 0;

  return (
    <div
      className={`grid text-center mt-10 sm:mt-14 ${
        showDays ? "grid-cols-4 gap-2 sm:gap-4" : "grid-cols-3"
      }`}
    >
      {showDays && (
        <div>
          <div className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-none text-gray-600">
            {time.days}
          </div>
          <div className="text-sm sm:text-base lg:text-[20px] text-gray-500">
            {time.days === 1 ? "Day" : "Days"}
          </div>
        </div>
      )}

      <div>
        <div className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-none text-gray-600">
          {mounted ? time.hrs : "00"}
        </div>
        <div className="text-sm sm:text-base lg:text-[20px] text-gray-500">Hrs</div>
      </div>

      <div>
        <div className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-none text-gray-600">
          {mounted ? time.min : "00"}
        </div>
        <div className="text-sm sm:text-base lg:text-[20px] text-gray-500">Min</div>
      </div>

      <div>
        <div className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold leading-none text-gray-600">
          {mounted ? time.sec : "00"}
        </div>
        <div className="text-sm sm:text-base lg:text-[20px] text-gray-500">Sec</div>
      </div>
    </div>
  );
}