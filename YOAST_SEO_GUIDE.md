# Yoast SEO Integration Guide

This guide explains how to integrate Yoast SEO from your WordPress backend into your Next.js frontend.

## What's Been Set Up

### 1. **GraphQL Queries with Yoast Fields** ([lib/queries.ts](lib/queries.ts))

Updated queries to fetch Yoast SEO metadata:

- `GET_ALL_POSTS` - All posts with SEO data
- `GET_POST_BY_SLUG` - Single post with full SEO data and schema
- `GET_ALL_PAGES` - All pages with SEO data
- `GET_PAGE_BY_SLUG` - Single page with full SEO data

### 2. **Types** ([lib/types.ts](lib/types.ts))

TypeScript interfaces for:

- `YoastSEO` - Yoast metadata structure
- `Post` - Post type with Yoast support
- `Page` - Page type with Yoast support

### 3. **SEO Utilities** ([lib/seo.ts](lib/seo.ts))

Utility functions:

- `generateSeoMetadata()` - Convert Yoast data to Next.js Metadata
- `getYoastSchema()` - Extract JSON-LD schema from Yoast
- `generateArticleSchema()` - Create custom article schema

### 4. **JSON-LD Component** ([components/JsonLdScript.tsx](components/JsonLdScript.tsx))

Component to inject Yoast's JSON-LD schema into page head

## How to Use

### Example 1: Dynamic Blog Post Page

```typescript
import { Metadata } from 'next'
import { GraphQLClient } from 'graphql-request'
import { GET_POST_BY_SLUG } from '@/lib/queries'
import { generateSeoMetadata } from '@/lib/seo'
import { Post } from '@/lib/types'
import { JsonLdScript } from '@/components/JsonLdScript'

interface Props {
  params: Promise<{ slug: string }>
}

const client = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!)

// This generates meta tags automatically from Yoast data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await client.request<{ postBy: Post }>(GET_POST_BY_SLUG, { slug })
  const post = data.postBy

  return generateSeoMetadata({
    title: post.title,
    description: post.excerpt,
    url: `https://yourdomain.com/blog/${post.slug}`,
    image: post.featuredImage?.node.sourceUrl,
    yoastSeo: post.yoastSeo, // Yoast data takes priority
  })
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const data = await client.request<{ postBy: Post }>(GET_POST_BY_SLUG, { slug })
  const post = data.postBy

  return (
    <>
      {/* This renders the JSON-LD schema from Yoast */}
      <JsonLdScript yoastSeo={post.yoastSeo} />

      <article>
        <h1>{post.title}</h1>
        {post.content && (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </article>
    </>
  )
}
```

### Example 2: Static Page with Yoast SEO

```typescript
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'
import { Page } from '@/lib/types'

const pageData: Page = {
  id: '1',
  title: 'About Us',
  slug: 'about',
  content: '...',
  yoastSeo: {
    metaDesc: 'Learn more about our company...',
    opengraphTitle: 'About Our Company',
    opengraphDescription: 'We are a leading...',
    // ... more Yoast data
  }
}

export const metadata: Metadata = generateSeoMetadata({
  title: pageData.title,
  yoastSeo: pageData.yoastSeo,
})

export default function About() {
  return <div>{pageData.content}</div>
}
```

## What Yoast Fields Are Available

Your WordPress GraphQL API exposes these Yoast fields:

```graphql
yoastSeo {
  metaDesc              # Meta description
  metaKeywords          # Target keywords
  opengraphTitle        # Open Graph title
  opengraphDescription  # Open Graph description
  opengraphImage {
    sourceUrl
  }
  twitterTitle          # Twitter Card title
  twitterDescription    # Twitter Card description
  twitterImage {
    sourceUrl
  }
  canonical             # Canonical URL
  schema {
    raw                 # JSON-LD schema (as string)
  }
}
```

## SEO Best Practices

1. **Always use `generateMetadata`** for dynamic pages
2. **Include `JsonLdScript` component** for structured data
3. **Update your domain** in the `url` parameter
4. **Test with** Google's Rich Results Test: https://search.google.com/test/rich-results
5. **Monitor Yoast scores** in WordPress to ensure quality content

## Testing Your SEO

### 1. Check Meta Tags

View page source and verify:

- `<title>` tag (from Yoast)
- `<meta name="description">` (from Yoast)
- `<meta property="og:*">` tags
- `<meta name="twitter:*">` tags
- `<link rel="canonical">` tag

### 2. Validate Structured Data

Use: https://schema.org/validator

### 3. Test OG Tags

Use: https://www.opengraph.xyz/

## Troubleshooting

### Schema not appearing?

- Check `yoastSeo.schema.raw` is not null
- Verify Yoast plugin is active on WordPress
- Check GraphQL query includes `schema { raw }`

### Meta tags not showing?

- Ensure `generateMetadata` is exported from page.tsx
- Verify Yoast data is being fetched correctly
- Check NEXT_PUBLIC_WORDPRESS_API_URL is set

### Wrong canonical URL?

- Set the `url` parameter in `generateSeoMetadata()`
- Or update canonical in WordPress Yoast settings

## Next Steps

1. Update all dynamic page components to use `generateMetadata`
2. Add `JsonLdScript` to pages with content
3. Update domain URLs from `yourdomain.com` to your actual domain
4. Test with Google Search Console
5. Monitor SEO performance in WordPress Yoast
