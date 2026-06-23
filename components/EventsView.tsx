"use client";

import EventCard from "@/components/EventCard";
import EventsCalendar from "@/components/EventsCalendar";
import { TecEvent } from "@/lib/types";
import { useState } from "react";

type View = "list" | "calendar";

export default function EventsView({
  upcoming,
  past,
  all,
}: {
  upcoming: TecEvent[];
  past: TecEvent[];
  all: TecEvent[];
}) {
  const [view, setView] = useState<View>("list");

  return (
    <div>
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-full border border-gray-200 p-1 bg-gray-50">
          {(["list", "calendar"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                view === v
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {v === "list" ? "📋 List" : "🗓️ Calendar"}
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? (
        <EventsCalendar events={all} />
      ) : (
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-8">Upcoming events</h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-500">No upcoming events right now.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8 text-gray-700">
                Past events
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} past />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
