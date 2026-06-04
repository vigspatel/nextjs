import { Metadata } from "next";
import { YoastSEO } from "./types";

interface SeoOptions {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  yoastSeo?: YoastSEO;
}

/**
 * Generate Next.js Metadata object from Yoast SEO data
 * Prioritizes Yoast data over fallback values
 */
export function generateSeoMetadata(options: SeoOptions): Metadata {
  const { title, description, url, image, yoastSeo } = options;

  const seoTitle = yoastSeo?.title || title;
  const metaDescription = yoastSeo?.metaDesc || description || "";
  const ogTitle = yoastSeo?.opengraphTitle || seoTitle;
  const ogDescription = yoastSeo?.opengraphDescription || description;
  const ogImage = yoastSeo?.opengraphImage?.sourceUrl || image;
  const canonicalUrl = yoastSeo?.canonical || url;
  const twitterTitle = yoastSeo?.twitterTitle || ogTitle;
  const twitterDescription = yoastSeo?.twitterDescription || ogDescription;

  const metadata: Metadata = {
    title: seoTitle,
    description: metaDescription || undefined,
    keywords: yoastSeo?.metaKeywords
      ? yoastSeo.metaKeywords.split(",").map((k) => k.trim())
      : undefined,
    // canonical is not a valid key on Next.js Metadata in this Next.js version.

    openGraph:
      ogImage || ogDescription
        ? {
            title: ogTitle,
            description: ogDescription,
            images: ogImage ? [{ url: ogImage }] : undefined,
            url: canonicalUrl,
            type: "website",
          }
        : undefined,
    twitter:
      ogImage || twitterDescription
        ? {
            card: "summary_large_image",
            title: twitterTitle,
            description: twitterDescription,
            images: yoastSeo?.twitterImage?.sourceUrl
              ? [yoastSeo.twitterImage.sourceUrl]
              : undefined,
          }
        : undefined,
  };

  return metadata;
}

/**
 * Generate JSON-LD schema from Yoast SEO raw schema
 */
export function getYoastSchema(yoastSeo?: YoastSEO): unknown {
  if (!yoastSeo?.schema?.raw) {
    return null;
  }

  try {
    return JSON.parse(yoastSeo.schema.raw);
  } catch {
    return null;
  }
}

/**
 * Create schema.org structured data for a blog post
 */
export function generateArticleSchema(
  title: string,
  content: string,
  publishedDate: string,
  author: string,
  image?: string,
  url?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: content.substring(0, 160),
    image: image,
    datePublished: publishedDate,
    author: {
      "@type": "Person",
      name: author,
    },
    url: url,
  };
}
