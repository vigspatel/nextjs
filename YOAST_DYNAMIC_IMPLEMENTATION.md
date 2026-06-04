# Dynamic Yoast SEO Implementation Guide

This guide explains how to automatically pull Yoast SEO data from your WordPress backend and apply it dynamically to your Next.js frontend.

## What You've Set Up

Your website now automatically:

1. **Fetches Yoast metadata** from WordPress GraphQL API
2. **Generates Next.js metadata** with proper meta tags
3. **Injects JSON-LD schema** for rich snippets

## How It Works

### 1. WordPress Backend

In your WordPress Yoast SEO settings:

- Set **SEO Title** → becomes `<title>` tag
- Set **Meta Description** → becomes `<meta name="description">`
- Set **Focus Keyphrase** → indexed by search engines
- Set **OpenGraph Title/Image** → used for social sharing
- Set **Schema** → injected as JSON-LD

### 2. Next.js Frontend Fetches & Applies This Data

```typescript
// Step 1: Fetch from WordPress
const seoData = await gqlClient.request(GET_PAGE_BY_SLUG, { slug: "home" });
const yoastSeo = seoData.pageBy.yoastSeo;

// Step 2: Generate Next.js metadata
export async function generateMetadata() {
  return generateSeoMetadata({
    title: "Page Title",
    yoastSeo: yoastSeo, // Yoast data takes priority!
  });
}

// Step 3: Render JSON-LD schema
return <JsonLdScript yoastSeo={yoastSeo} />;
```

## Implementation for All Pages

### ✅ Already Implemented

- [x] **Homepage** - Fetches Yoast "home" page data
- [x] **Blog Page** - Lists all posts with SEO
- [x] **About Page** - Fetches Yoast "about" page data
- [x] **Blog Post Pages** - Dynamic per-post SEO ([blog/[slug]/page.tsx](../blog/[slug]/page.tsx))

### To Add to Other Pages

Follow this pattern for any page (e.g., Services, Contact, Portfolio):

#### Step 1: Add Imports

```typescript
import { Metadata } from "next";
import { GraphQLClient } from "graphql-request";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { JsonLdScript } from "@/components/JsonLdScript";
```

#### Step 2: Add generateMetadata Function

```typescript
export async function generateMetadata(): Promise<Metadata> {
  try {
    const gqlClient = new GraphQLClient(
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "...",
    );

    const data = await gqlClient.request<{ pageBy: Page }>(
      GET_PAGE_BY_SLUG,
      { slug: "services" }, // Change this to your page slug
    );

    return generateSeoMetadata({
      title: data.pageBy?.title || "Services",
      url: "https://yourdomain.com/services", // Update URL
      yoastSeo: data.pageBy?.yoastSeo,
    });
  } catch (error) {
    console.error("Error fetching Yoast SEO data:", error);
    return { title: "Services" };
  }
}
```

#### Step 3: Fetch & Store Yoast Data in Page Component

```typescript
export default async function ServicesPage() {
  let yoastData = null;

  // Your existing page data fetch...

  // Add Yoast fetch:
  try {
    const gqlClient = new GraphQLClient(
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "..."
    );
    const seoData = await gqlClient.request<{ pageBy: Page }>(
      GET_PAGE_BY_SLUG,
      { slug: "services" }
    );
    yoastData = seoData.pageBy?.yoastSeo;
  } catch (error) {
    console.error("Error fetching Yoast data:", error);
  }

  return (
    <>
      <JsonLdScript yoastSeo={yoastData} />
      {/* Rest of your page... */}
    </>
  );
}
```

## Checking Yoast Data in WordPress

1. Go to your WordPress page/post in the editor
2. Scroll down to **Yoast SEO** box
3. Fill in:
   - **SEO Title** - What shows in search results
   - **Meta Description** - Description under title
   - **Focus Keyphrase** - Main keyword (like "nextjs-demo")
   - **OpenGraph** - Social media sharing (title, description, image)
   - **XML Sitemap** - Make sure "Include" is checked

## Verifying It Works

### 1. Check Meta Tags in Page Source

```bash
# Open your page
Right-click → View Page Source
# Search for:
<title>Your Yoast Title</title>
<meta name="description" content="Your Yoast description">
<meta property="og:title" content="Your OG Title">
<meta property="og:image" content="Your OG Image">
```

### 2. Test with Tools

- **Google Search Results:** https://search.google.com/test/rich-results
- **OG Tags Preview:** https://www.opengraph.xyz/
- **Structured Data:** https://schema.org/validator
- **Twitter Card:** https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-large-image-card

### 3. Check Browser DevTools

```
Open DevTools → Network → Filter by XHR
Look for requests to your GraphQL endpoint
Check that `yoastSeo` data is being returned
```

## Troubleshooting

### Meta tags not showing?

1. Check page source (right-click → View Source)
2. Search for `<title>` tag
3. If missing: `generateMetadata` might not be exported
4. Solution: Make sure `export async function generateMetadata()` is at top level

### Yoast data not fetching?

1. Open browser console (F12)
2. Check for errors in Network tab
3. Verify WordPress GraphQL returns `yoastSeo` field
4. Test query manually using: https://bluereeftech.com/demo-next-js/graphql

### JSON-LD schema not appearing?

1. `JsonLdScript` component must be in JSX
2. Check `yoastData` is not null
3. Verify Yoast has "Schema" configured in WordPress
4. Test with: https://schema.org/validator

### Wrong content showing?

1. Make sure slug matches WordPress page slug
2. Update from `slug: "home"` to your actual page slug
3. Check WordPress page is published
4. Ensure Yoast SEO fields are filled in WordPress

## Page Slugs to Use

Map your Next.js routes to WordPress page slugs:

| Next.js Route     | WordPress Slug | Slug in Code              |
| ----------------- | -------------- | ------------------------- |
| `/` (home)        | Homepage       | `"home"`                  |
| `/about`          | About page     | `"about"`                 |
| `/services`       | Services page  | `"services"`              |
| `/contact`        | Contact page   | `"contact"`               |
| `/portfolio`      | Portfolio page | `"portfolio"`             |
| `/blog`           | Blog listing   | N/A (use `GET_ALL_POSTS`) |
| `/blog/post-name` | Post slug      | (handled by `[slug]`)     |

## Environment Variables

Make sure `.env.local` has:

```
NEXT_PUBLIC_WORDPRESS_API_URL=https://bluereeftech.com/demo-next-js/graphql
```

## Next Steps

1. ✅ Update all static pages to use `generateMetadata`
2. ✅ Add `JsonLdScript` to all main pages
3. ✅ Test with Google Search Console
4. ✅ Update domain from `yourdomain.com` to your actual domain
5. ✅ Monitor in WordPress → Yoast SEO → Tools → Site Health

## Example: Full Page with Dynamic Yoast SEO

```typescript
import { Metadata } from "next";
import { GraphQLClient } from "graphql-request";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { JsonLdScript } from "@/components/JsonLdScript";

// 1. Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!);
  const data = await gqlClient.request<{ pageBy: Page }>(
    GET_PAGE_BY_SLUG,
    { slug: "services" }
  );

  return generateSeoMetadata({
    title: data.pageBy?.title || "Services",
    url: "https://yourdomain.com/services",
    yoastSeo: data.pageBy?.yoastSeo,
  });
}

// 2. Render page with JSON-LD
export default async function ServicesPage() {
  const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!);
  const data = await gqlClient.request<{ pageBy: Page }>(
    GET_PAGE_BY_SLUG,
    { slug: "services" }
  );

  return (
    <>
      <JsonLdScript yoastSeo={data.pageBy?.yoastSeo} />
      <h1>{data.pageBy?.title}</h1>
      {/* Your page content */}
    </>
  );
}
```

That's it! Your website now has fully dynamic SEO! 🚀
