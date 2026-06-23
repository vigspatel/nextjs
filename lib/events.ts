import { EventVenue, TecEvent } from "./types";

/** TEC dates look like "2026-07-10 09:00:00" (site timezone). Parse as local. */
export function parseEventDate(value: string): Date {
  return new Date(value.replace(" ", "T"));
}

/** Date key "YYYY-MM-DD" straight from the TEC string (no timezone shifting). */
export function eventDateKey(value: string): string {
  return value.slice(0, 10);
}

export function isPastEvent(event: TecEvent): boolean {
  return parseEventDate(event.end_date).getTime() < Date.now();
}

export function formatEventDate(
  start: string,
  end: string,
  allDay?: boolean,
): string {
  const s = parseEventDate(start);
  const e = parseEventDate(end);
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  const datePart = s.toLocaleDateString("en-US", dateOpts);
  if (allDay) return `${datePart} · All day`;
  return `${datePart} · ${s.toLocaleTimeString(
    "en-US",
    timeOpts,
  )} – ${e.toLocaleTimeString("en-US", timeOpts)}`;
}

export function venueName(venue?: EventVenue | EventVenue[]): string | null {
  if (!venue) return null;
  const v = Array.isArray(venue) ? venue[0] : venue;
  return v?.venue || null;
}

/** Sort ascending by start date. */
export function sortByStart(a: TecEvent, b: TecEvent): number {
  return parseEventDate(a.start_date).getTime() -
    parseEventDate(b.start_date).getTime();
}
