import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import {
  ALTERNATIVES,
  ALTERNATIVE_SLUGS,
  buildAlternativeBreadcrumbJsonLd,
  buildAlternativeFaqJsonLd,
  comparisonFact,
  getAlternative,
} from '#/features/marketing/alternatives-content.ts'
import { COMPARISON, SITE } from '#/features/marketing/landing-content.ts'

describe('alternatives content', () => {
  test('every slug has a unique, keyword-bearing SEO title and description', () => {
    const titles = new Set<string>()
    for (const slug of ALTERNATIVE_SLUGS) {
      const alternative = ALTERNATIVES[slug]
      expect(alternative.seoTitle.length).toBeGreaterThan(0)
      expect(alternative.seoDescription.length).toBeGreaterThan(0)
      expect(titles.has(alternative.seoTitle)).toBe(false)
      titles.add(alternative.seoTitle)
      expect(alternative.faq).toHaveLength(2)
    }
  })

  test('getAlternative returns undefined for unknown slugs', () => {
    expect(getAlternative('tally')).toBeDefined()
    expect(getAlternative('not-a-real-competitor')).toBeUndefined()
  })

  test('comparisonFact reads the same table shown on the homepage', () => {
    expect(comparisonFact('Pricing model', 'Celestret')).toBe(
      'Free & open source',
    )
    expect(comparisonFact('Pricing model', 'Tally')).toBe('Paid license')
    expect(comparisonFact('Self-hostable', 'Zoho Books')).toBe('No')
  })

  test('every competitor name used in content matches a comparison table column', () => {
    for (const slug of ALTERNATIVE_SLUGS) {
      const alternative = ALTERNATIVES[slug]
      expect(COMPARISON.columns).toContain(alternative.name)
    }
  })

  test('FAQPage JSON-LD mirrors the visible FAQ for each alternative', () => {
    for (const slug of ALTERNATIVE_SLUGS) {
      const alternative = ALTERNATIVES[slug]
      const jsonLd = buildAlternativeFaqJsonLd(alternative)
      expect(jsonLd['@type']).toBe('FAQPage')
      expect(jsonLd.mainEntity).toHaveLength(alternative.faq.length)
      for (const item of alternative.faq) {
        const entity = jsonLd.mainEntity.find(
          (entry) => entry.name === item.question,
        )
        expect(entity?.acceptedAnswer.text).toBe(item.answer)
      }
    }
  })

  test('BreadcrumbList JSON-LD ends at the alternative page URL', () => {
    const jsonLd = buildAlternativeBreadcrumbJsonLd(ALTERNATIVES.tally)
    expect(jsonLd['@type']).toBe('BreadcrumbList')
    const last = jsonLd.itemListElement.at(-1)
    expect(last?.item).toBe(`${SITE.url}/alternatives/tally`)
  })

  test('marketing sources never import app shell or trpc', () => {
    const forbidden = [
      'AppShell',
      'WorkspaceProvider',
      'WorkspaceLoadingGate',
      'trpcClient',
      'integrations/tanstack-query/root-provider',
    ]
    const root = path.resolve(import.meta.dirname)
    const files = ['alternatives-content.ts', 'components/alternative-page.tsx']

    for (const file of files) {
      const source = readFileSync(path.join(root, file), 'utf8')
      for (const token of forbidden) {
        expect(source, `${file} must not mention ${token}`).not.toContain(
          token,
        )
      }
    }
  })
})
