import { createFileRoute, notFound } from '@tanstack/react-router'

import { AlternativePage } from '#/features/marketing/components/alternative-page.tsx'
import type { AlternativeSlug } from '#/features/marketing/alternatives-content.ts'
import {
  ALTERNATIVES,
  ALTERNATIVE_SLUGS,
  buildAlternativeBreadcrumbJsonLd,
  buildAlternativeFaqJsonLd,
} from '#/features/marketing/alternatives-content.ts'
import {
  SITE,
  buildSocialImageMeta,
  buildSoftwareJsonLd,
} from '#/features/marketing/landing-content.ts'

function isAlternativeSlug(value: string): value is AlternativeSlug {
  return (ALTERNATIVE_SLUGS as ReadonlyArray<string>).includes(value)
}

export const Route = createFileRoute('/alternatives/$competitor')({
  loader: ({ params }) => {
    if (!isAlternativeSlug(params.competitor)) throw notFound()
    return ALTERNATIVES[params.competitor]
  },
  head: ({ loaderData: alternative }) => {
    if (!alternative) return {}

    const url = `${SITE.url}/alternatives/${alternative.slug}`

    return {
      meta: [
        { title: alternative.seoTitle },
        { name: 'description', content: alternative.seoDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: alternative.seoTitle },
        { property: 'og:description', content: alternative.seoDescription },
        { property: 'og:site_name', content: SITE.name },
        ...buildSocialImageMeta(),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: alternative.seoTitle },
        { name: 'twitter:description', content: alternative.seoDescription },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(buildSoftwareJsonLd()),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(buildAlternativeFaqJsonLd(alternative)),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(buildAlternativeBreadcrumbJsonLd(alternative)),
        },
      ],
    }
  },
  component: AlternativeRoute,
})

function AlternativeRoute() {
  const alternative = Route.useLoaderData()
  return <AlternativePage slug={alternative.slug} />
}
