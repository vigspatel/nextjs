# Yoast SEO - Quick Reference

## Quick Copy-Paste Templates

### Template 1: Dynamic Blog Post Page

Create `app/blog/[slug]/page.tsx`:

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await client.request<{ postBy: Post }>(GET_POST_BY_SLUG, { slug })
  if (!data.postBy) return { title: 'Not found' }

  return generateSeoMetadata({
    title: data.postBy.title,
    description: data.postBy.excerpt,
    url: `https://yourdomain.com/blog/${data.postBy.slug}`,
    image: data.postBy.featuredImage?.node.sourceUrl,
    yoastSeo: data.postBy.yoastSeo,
  })
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const data = await client.request<{ postBy: Post }>(GET_POST_BY_SLUG, { slug })
  const post = data.postBy

  return (
    <>
      <JsonLdScript yoastSeo={post.yoastSeo} />
      <article>
        <h1>{post.title}</h1>
        {post.content && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
      </article>
    </>
  )
}
```

### Template 2: Dynamic Page

Create `app/[slug]/page.tsx`:

```typescript
import { Metadata } from 'next'
import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG } from '@/lib/queries'
import { generateSeoMetadata } from '@/lib/seo'
import { Page } from '@/lib/types'
import { JsonLdScript } from '@/components/JsonLdScript'

interface Props {
  params: Promise<{ slug: string }>
}

const client = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await client.request<{ pageBy: Page }>(GET_PAGE_BY_SLUG, { slug })
  if (!data.pageBy) return { title: 'Not found' }

  return generateSeoMetadata({
    title: data.pageBy.title,
    url: `https://yourdomain.com/${data.pageBy.slug}`,
    yoastSeo: data.pageBy.yoastSeo,
  })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const data = await client.request<{ pageBy: Page }>(GET_PAGE_BY_SLUG, { slug })
  const page = data.pageBy

  return (
    <>
      <JsonLdScript yoastSeo={page.yoastSeo} />
      <div>
        <h1>{page.title}</h1>
        {page.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
      </div>
    </>
  )
}
```

### Template 3: Static Page (e.g., About, Contact)

Create or update your page with:

```typescript
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSeoMetadata({
  title: 'About Us',
  description: 'Learn about our company and mission',
  url: 'https://yourdomain.com/about',
  yoastSeo: {
    metaDesc: 'Your Yoast meta description here',
    opengraphTitle: 'About Us - Your Site',
    opengraphDescription: 'Learn about our company and mission',
    opengraphImage: { sourceUrl: 'https://yourdomain.com/og-image.jpg' },
  },
})

export default function About() {
  return <div>Your content here</div>
}
```

### Template 4: Blog Listing Page

```typescript
import { Metadata } from 'next'
import { GraphQLClient } from 'graphql-request'
import { GET_ALL_POSTS } from '@/lib/queries'

const client = new GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!)

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest blog posts',
  openGraph: {
    title: 'Blog',
    description: 'Read our latest blog posts',
    url: 'https://yourdomain.com/blog',
  },
}

export default async function BlogList() {
  const data = await client.request(GET_ALL_POSTS)

  return (
    <div>
      <h1>Blog</h1>
      {data.posts.nodes.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

## What Gets Set in Meta Tags

| Yoast Field            | Next.js Meta            | HTML Tag                              |
| ---------------------- | ----------------------- | ------------------------------------- |
| `metaDesc`             | `description`           | `<meta name="description">`           |
| `metaKeywords`         | `keywords`              | `<meta name="keywords">`              |
| `opengraphTitle`       | `openGraph.title`       | `<meta property="og:title">`          |
| `opengraphDescription` | `openGraph.description` | `<meta property="og:description">`    |
| `opengraphImage`       | `openGraph.image`       | `<meta property="og:image">`          |
| `twitterTitle`         | `twitter.title`         | `<meta name="twitter:title">`         |
| `twitterDescription`   | `twitter.description`   | `<meta name="twitter:description">`   |
| `canonical`            | `canonical`             | `<link rel="canonical">`              |
| `schema`               | JSON-LD                 | `<script type="application/ld+json">` |

## Environment Variables

Make sure these are set in `.env.local`:

```
NEXT_PUBLIC_WORDPRESS_API_URL=https://bluereeftech.com/demo-next-js/graphql
```

## Testing Checklist

- [ ] View page source and verify meta tags are present
- [ ] Test with https://www.opengraph.xyz/
- [ ] Test with https://search.google.com/test/rich-results
- [ ] Check console for no errors
- [ ] Verify images load correctly
- [ ] Test Twitter Card preview
- [ ] Validate with https://schema.org/validator

## Common Issues & Solutions

**Meta tags not showing?**

- Make sure `generateMetadata` is exported from your page
- Check GraphQL query is returning Yoast data
- Verify Yoast plugin is active in WordPress

**Schema not rendering?**

- Check `yoastSeo.schema.raw` has data
- Include `JsonLdScript` component in your page
- Test with https://schema.org/validator

**Wrong URL in canonical?**

- Update the `url` parameter in `generateSeoMetadata()`
- Or update canonical in WordPress Yoast settings

**Images not showing in OG tags?**

- Verify image URL is absolute (not relative)
- Check image is accessible publicly
- Use https://www.opengraph.xyz/ to debug
