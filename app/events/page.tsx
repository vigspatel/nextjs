import { getEvents } from "@/lib/api";
import { EventVenue, TecEvent } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events, workshops and trainings.",
};

function formatEventDate(start: string, end: string, allDay?: boolean) {
  const startDate = new Date(start.replace(" ", "T"));
  const endDate = new Date(end.replace(" ", "T"));

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

  const datePart = startDate.toLocaleDateString("en-US", dateOpts);
  if (allDay) return `${datePart} · All day`;

  return `${datePart} · ${startDate.toLocaleTimeString(
    "en-US",
    timeOpts,
  )} – ${endDate.toLocaleTimeString("en-US", timeOpts)}`;
}

function venueName(venue?: EventVenue | EventVenue[]): string | null {
  if (!venue) return null;
  const v = Array.isArray(venue) ? venue[0] : venue;
  return v?.venue || null;
}

export default async function EventsPage() {
  // Pass start_date to include events from the past too; remove for upcoming-only.
  const events: TecEvent[] = await getEvents();

  return (
    <>
      <div className="bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Events</h1>
          <p className="text-indigo-200 text-lg">
            Join our upcoming workshops, trainings and meetups
          </p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {events.length === 0 ? (
            <p className="text-center text-gray-500">
              No upcoming events right now. Please check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {events.map((event) => {
                const venue = venueName(event.venue);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
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
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-300 text-5xl">
                        📅
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-xs text-indigo-500 font-semibold uppercase tracking-widest">
                        {formatEventDate(
                          event.start_date,
                          event.end_date,
                          event.all_day,
                        )}
                      </span>
                      <h3 className="text-lg font-bold mt-2 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>
                      {venue && (
                        <p className="text-sm text-gray-500 mt-1">📍 {venue}</p>
                      )}
                      {event.cost && (
                        <p className="text-sm font-semibold text-gray-700 mt-auto pt-3">
                          {event.cost}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
