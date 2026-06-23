import EventsView from "@/components/EventsView";
import { getEvents } from "@/lib/api";
import { isPastEvent, sortByStart } from "@/lib/events";
import { TecEvent } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events, workshops and trainings.",
};

export default async function EventsPage() {
  // start_date in the past makes TEC return past events too (it defaults to upcoming-only).
  const events: TecEvent[] = await getEvents({
    start_date: "2000-01-01",
    per_page: 100,
  });

  const all = [...events].sort(sortByStart);
  const past = all.filter(isPastEvent).reverse(); // most-recent past first
  const upcoming = all.filter((e) => !isPastEvent(e));

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
          <EventsView upcoming={upcoming} past={past} all={all} />
        </div>
      </section>
    </>
  );
}
