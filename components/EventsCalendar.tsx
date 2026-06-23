"use client";

import { eventDateKey } from "@/lib/events";
import { TecEvent } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function localKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function EventsCalendar({ events }: { events: TecEvent[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  // Group events by their YYYY-MM-DD start key.
  const byDay = useMemo(() => {
    const map = new Map<string, TecEvent[]>();
    for (const ev of events) {
      const key = eventDateKey(ev.start_date);
      const list = map.get(key);
      if (list) list.push(ev);
      else map.set(key, [ev]);
    }
    return map;
  }, [events]);

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = localKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  // Build the grid cells (leading blanks + days).
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goPrev = () =>
    setCursor(({ year, month }) =>
      month === 0
        ? { year: year - 1, month: 11 }
        : { year, month: month - 1 },
    );
  const goNext = () =>
    setCursor(({ year, month }) =>
      month === 11
        ? { year: year + 1, month: 0 }
        : { year, month: month + 1 },
    );
  const goToday = () =>
    setCursor({ year: today.getFullYear(), month: today.getMonth() });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous month"
            className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={goToday}
            className="px-4 h-9 rounded-full border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goNext}
            aria-label="Next month"
            className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="bg-gray-50 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 py-2"
          >
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="bg-white min-h-28" />;
          }
          const key = localKey(year, month, day);
          const dayEvents = byDay.get(key) ?? [];
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className="bg-white min-h-28 p-1.5 flex flex-col gap-1"
            >
              <span
                className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600"
                }`}
              >
                {day}
              </span>
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.slug}`}
                    title={ev.title}
                    className="block truncate text-[11px] leading-tight bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded px-1.5 py-1 transition-colors"
                  >
                    {ev.title}
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-gray-400 px-1">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
