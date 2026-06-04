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
