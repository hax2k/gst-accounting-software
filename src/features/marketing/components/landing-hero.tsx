import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, GitBranchIcon } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import {
  InvoicePreview,
  ReportsPreview,
} from '#/features/marketing/components/product-preview.tsx'
import { HERO, SITE } from '#/features/marketing/landing-content.ts'

export function LandingHero() {
  return (
    <section
      className="relative overflow-hidden"
      data-ui="chrome"
      id="top"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.94_0.02_95),transparent_55%),linear-gradient(180deg,var(--shell-canvas),var(--background)_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
        <div className="flex flex-col gap-6">
          <p className="font-heading text-sm font-medium tracking-wide text-muted-foreground">
            {SITE.name}
          </p>
          <h1 className="max-w-xl font-heading text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {HERO.headline}
          </h1>
          <p className="max-w-lg text-base text-pretty text-muted-foreground md:text-lg">
            {HERO.subhead}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to={HERO.primaryCta.to}>
                {HERO.primaryCta.label}
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={HERO.secondaryCta.href}
                rel="noreferrer"
                target="_blank"
              >
                <GitBranchIcon data-icon="inline-start" />
                {HERO.secondaryCta.label}
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{HERO.reassurance}</p>
        </div>

        <div className="relative min-h-72 md:min-h-96">
          <ReportsPreview className="absolute top-0 right-0 w-[78%] rotate-2 opacity-90 max-md:hidden" />
          <InvoicePreview className="relative z-10 w-full max-w-xl md:mt-10 md:w-[92%] md:-rotate-1" />
        </div>
      </div>
    </section>
  )
}
