import { JsonLdScript } from "@/components/JsonLdScript";
import { getEventBySlug, getEvents } from "@/lib/api";
import { generateSeoMetadata } from "@/lib/seo";
import { EventOrganizer, EventVenue } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://bluereeftech.com/demo-next-js";

// Pre-render a static page per event at build time.
export async function generateStaticParams() {
  const events = await getEvents({ start_date: "2000-01-01", per_page: 100 });
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event not found" };

  const plain = event.description?.replace(/<[^>]+>/g, "").trim();
  return generateSeoMetadata({
    title: event.title,
    description: event.excerpt || plain?.substring(0, 160),
    url: `${SITE_URL}/events/${event.slug}`,
    image: event.image ? event.image.url : undefined,
  });
}

function one<T>(value?: T | T[]): T | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function formatRange(start: string, end: string, allDay?: boolean) {
  const s = new Date(start.replace(" ", "T"));
  const e = new Date(end.replace(" ", "T"));
  const d: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const t: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const datePart = s.toLocaleDateString("en-US", d);
  if (allDay) return `${datePart} · All day`;
  return `${datePart} · ${s.toLocaleTimeString("en-US", t)} – ${e.toLocaleTimeString("en-US", t)}`;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const venue: EventVenue | undefined = one(event.venue);
  const organizer: EventOrganizer | undefined = one(event.organizer);

  // schema.org structured data for the event
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description?.replace(/<[^>]+>/g, "").trim(),
    startDate: event.start_date,
    endDate: event.end_date,
    eventStatus: "https://schema.org/EventScheduled",
    image: event.image ? event.image.url : undefined,
    url: `${SITE_URL}/events/${event.slug}`,
    location: venue?.venue
      ? {
          "@type": "Place",
          name: venue.venue,
          address: [venue.address, venue.city, venue.state, venue.country]
            .filter(Boolean)
            .join(", "),
        }
      : undefined,
    organizer: organizer?.organizer
      ? { "@type": "Organization", name: organizer.organizer, url: organizer.website }
      : undefined,
  };

  return (
    <>
      <JsonLdScript schema={eventSchema} />

      <article className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <Link
          href="/events"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to events
        </Link>

        {event.image && (
          <div className="relative w-full h-72 my-8 rounded-xl overflow-hidden">
            <Image
              src={event.image.url}
              alt={event.image.alt || event.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-extrabold mb-4">{event.title}</h1>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-8">
          <span>
            🗓️ {formatRange(event.start_date, event.end_date, event.all_day)}
          </span>
          {venue?.venue && <span>📍 {venue.venue}</span>}
          {event.cost && <span>🎟️ {event.cost}</span>}
        </div>

        {event.description && (
          <div
            className="prose prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}

        <div className="grid sm:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
          {venue?.venue && (
            <div>
              <h2 className="font-bold text-gray-900 mb-1">Venue</h2>
              <p className="text-gray-600">{venue.venue}</p>
              {(venue.address || venue.city) && (
                <p className="text-gray-500 text-sm">
                  {[venue.address, venue.city, venue.state, venue.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          )}
          {organizer?.organizer && (
            <div>
              <h2 className="font-bold text-gray-900 mb-1">Organizer</h2>
              <p className="text-gray-600">{organizer.organizer}</p>
              {organizer.email && (
                <p className="text-gray-500 text-sm">{organizer.email}</p>
              )}
            </div>
          )}
        </div>

        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-10 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Visit event website
          </a>
        )}
      </article>
    </>
  );
}
