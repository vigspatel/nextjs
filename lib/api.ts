import { TecEvent } from "./types";

const REST_API =
  process.env.NEXT_PUBLIC_WORDPRESS_REST_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, "") ||
  "https://bluereeftech.com/demo-next-js";

export async function getHomePage() {
  const res = await fetch(`${REST_API}/wp-json/wp/v2/pages?slug=home&acf_format=standard`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data) ? data[0] : null;
}

export async function getPageYoastData(slug: string) {
  const res = await fetch(`${REST_API}/wp-json/wp/v2/pages?slug=${slug}&_fields=title,content,yoast_head_json`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data) ? data[0] : null;
}

/* The Events Calendar — tribe/events/v1 REST API */

const EVENTS_API = `${REST_API}/wp-json/tribe/events/v1`;

/**
 * Fetch a list of events.
 * By default The Events Calendar returns only upcoming events. Pass
 * `start_date` (e.g. "2000-01-01") to also include past events.
 */
export async function getEvents(
  params: Record<string, string | number> = {},
): Promise<TecEvent[]> {
  const search = new URLSearchParams({
    per_page: "50",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  });

  const res = await fetch(`${EVENTS_API}/events?${search.toString()}`, {
    // Revalidate every 5 min; switch to "no-store" for always-fresh data.
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.events) ? data.events : [];
}

/**
 * Fetch a single event by its slug via the TEC by-slug endpoint.
 */
export async function getEventBySlug(slug: string): Promise<TecEvent | null> {
  const res = await fetch(`${EVENTS_API}/events/by-slug/${slug}`, {
    next: { revalidate: 300 },
  });

  if (res.ok) {
    const data = await res.json();
    if (data?.id) return data as TecEvent;
  }

  // Fallback: scan the list and match on slug (covers past events too).
  const events = await getEvents({ start_date: "2000-01-01", per_page: 100 });
  return events.find((e) => e.slug === slug) ?? null;
}