export interface YoastSEO {
  title?: string;
  metaDesc?: string;
  metaKeywords?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: {
    sourceUrl?: string;
  };
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    sourceUrl?: string;
  };
  canonical?: string;
  schema?: {
    raw?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  author?: {
    node: {
      name: string;
    };
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  seo?: YoastSEO;
  yoastSeo?: YoastSEO;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  seo?: YoastSEO;
  yoastSeo?: YoastSEO;
}

/* The Events Calendar (tribe/events/v1) */

export interface EventImage {
  url: string;
  alt?: string;
  sizes?: Record<string, { url: string; width: number; height: number }>;
}

export interface EventVenue {
  id?: number;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  website?: string;
}

export interface EventOrganizer {
  id?: number;
  organizer?: string;
  phone?: string;
  website?: string;
  email?: string;
}

export interface EventTerm {
  name: string;
  slug: string;
}

export interface TecEvent {
  id: number;
  global_id?: string;
  status?: string;
  url: string;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  image?: EventImage | false;
  all_day?: boolean;
  start_date: string;
  end_date: string;
  utc_start_date?: string;
  utc_end_date?: string;
  timezone?: string;
  cost?: string;
  website?: string;
  venue?: EventVenue | EventVenue[];
  organizer?: EventOrganizer | EventOrganizer[];
  categories?: EventTerm[];
  tags?: EventTerm[];
}
