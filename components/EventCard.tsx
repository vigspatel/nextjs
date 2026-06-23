import { formatEventDate, venueName } from "@/lib/events";
import { TecEvent } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function EventCard({
  event,
  past = false,
}: {
  event: TecEvent;
  past?: boolean;
}) {
  const venue = venueName(event.venue);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 ${
        past ? "opacity-75" : ""
      }`}
    >
      {event.image ? (
        <div className="relative h-48 w-full">
          <Image
            src={event.image.url}
            alt={event.image.alt || event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {past && (
            <span className="absolute top-3 left-3 bg-gray-900/70 text-white text-xs px-2 py-1 rounded-full">
              Past
            </span>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-300 text-5xl">
          📅
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs text-indigo-500 font-semibold uppercase tracking-widest">
          {formatEventDate(event.start_date, event.end_date, event.all_day)}
        </span>
        <h3 className="text-lg font-bold mt-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>
        {venue && <p className="text-sm text-gray-500 mt-1">📍 {venue}</p>}
        {event.cost && (
          <p className="text-sm font-semibold text-gray-700 mt-auto pt-3">
            {event.cost}
          </p>
        )}
      </div>
    </Link>
  );
}
