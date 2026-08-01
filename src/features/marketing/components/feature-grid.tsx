import {
  BanknoteIcon,
  BoxesIcon,
  FileSpreadsheetIcon,
  ReceiptIndianRupeeIcon,
  ShoppingCartIcon,
  UsersIcon,
} from 'lucide-react'

import type { CSSProperties } from 'react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { FEATURES } from '#/features/marketing/landing-content.ts'
import type { FeatureTone } from '#/features/marketing/landing-content.ts'
import { cn } from '#/lib/utils.ts'

const TONE_ICON = {
  'money-in': ReceiptIndianRupeeIcon,
  'money-out': ShoppingCartIcon,
  gst: FileSpreadsheetIcon,
  inventory: BoxesIcon,
  banking: BanknoteIcon,
  foreground: UsersIcon,
} as const

const TONE_VAR: Record<FeatureTone, string> = {
  'money-in': 'var(--money-in)',
  'money-out': 'var(--money-out)',
  gst: 'var(--gst)',
  inventory: 'var(--inventory)',
  banking: 'var(--banking)',
  foreground: 'var(--foreground)',
}

export function FeatureGrid() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 md:py-20"
      data-ui="chrome"
      id={FEATURES.id}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {FEATURES.title}
        </h2>
        <p className="text-muted-foreground">{FEATURES.subtitle}</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.items.map((feature) => {
          const Icon = TONE_ICON[feature.tone]
          return (
            <Card key={feature.title} size="hero">
              <CardHeader>
                <div
                  className="icon-duotone mb-2 grid size-10 place-items-center rounded-full bg-[color-mix(in_oklch,var(--icon-tone)_16%,transparent)]"
                  style={
                    {
                      '--icon-tone': TONE_VAR[feature.tone],
                    } as CSSProperties
                  }
                >
                  <Icon
                    className={cn('size-5')}
                    data-icon-stroke=""
                    style={{ color: TONE_VAR[feature.tone] }}
                  />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.body}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
