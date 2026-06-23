import { YoastSEO } from '@/lib/types'
import { getYoastSchema } from '@/lib/seo'

interface JsonLdScriptProps {
  yoastSeo?: YoastSEO
  /** A ready-made JSON-LD object (used when there is no Yoast data, e.g. events) */
  schema?: unknown
}

/**
 * Component to render JSON-LD structured data in the page.
 * Pass `yoastSeo` to render Yoast's schema, or `schema` for a custom object.
 */
export function JsonLdScript({ yoastSeo, schema: rawSchema }: JsonLdScriptProps) {
  const schema = rawSchema ?? getYoastSchema(yoastSeo)

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
