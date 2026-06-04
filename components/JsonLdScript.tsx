import { YoastSEO } from '@/lib/types'
import { getYoastSchema } from '@/lib/seo'

interface JsonLdScriptProps {
  yoastSeo?: YoastSEO
}

/**
 * Component to render Yoast SEO schema (JSON-LD) in page head
 * Should be used in your page or layout to inject structured data
 */
export function JsonLdScript({ yoastSeo }: JsonLdScriptProps) {
  const schema = getYoastSchema(yoastSeo)

  if (!schema) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
