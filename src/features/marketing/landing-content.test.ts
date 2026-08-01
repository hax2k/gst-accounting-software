import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import {
  FAQ,
  HERO,
  SITE,
  buildFaqJsonLd,
  buildSoftwareJsonLd,
} from '#/features/marketing/landing-content.ts'

describe('landing content', () => {
  test('FAQPage JSON-LD includes every visible FAQ answer', () => {
    const jsonLd = buildFaqJsonLd()
    expect(jsonLd['@type']).toBe('FAQPage')
    expect(jsonLd.mainEntity).toHaveLength(FAQ.items.length)

    for (const item of FAQ.items) {
      const entity = jsonLd.mainEntity.find(
        (entry) => entry.name === item.question,
      )
      expect(entity).toBeDefined()
      expect(entity?.acceptedAnswer.text).toBe(item.answer)
    }
  })

  test('SoftwareApplication JSON-LD is free INR offer', () => {
    const jsonLd = buildSoftwareJsonLd()
    expect(jsonLd.name).toBe(SITE.name)
    expect(jsonLd.offers.price).toBe('0')
    expect(jsonLd.offers.priceCurrency).toBe('INR')
  })

  test('primary CTA targets signup', () => {
    expect(HERO.primaryCta.to).toBe('/signup')
    expect(HERO.secondaryCta.href).toBe(SITE.githubUrl)
  })

  test('landing sources never import app shell or trpc client', () => {
    const forbidden = [
      'AppShell',
      'WorkspaceProvider',
      'WorkspaceLoadingGate',
      'trpcClient',
      'integrations/tanstack-query/root-provider',
    ]
    const root = path.resolve(import.meta.dirname)
    const files = [
      'landing-content.ts',
      'components/landing-page.tsx',
      'components/landing-header.tsx',
      'components/landing-hero.tsx',
      'components/how-it-works.tsx',
      'components/keyboard-speed.tsx',
      'components/feature-grid.tsx',
      'components/comparison-table.tsx',
      'components/roadmap-strip.tsx',
      'components/landing-faq.tsx',
      'components/landing-cta.tsx',
      'components/landing-footer.tsx',
      'components/product-preview.tsx',
      'components/alternative-page.tsx',
    ]

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
