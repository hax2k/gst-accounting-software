import { Badge } from '#/components/ui/badge.tsx'
import { ROADMAP } from '#/features/marketing/landing-content.ts'

export function RoadmapStrip() {
  return (
    <section
      className="border-y border-border/70 bg-muted/30"
      data-ui="chrome"
      id={ROADMAP.id}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
            {ROADMAP.title}
          </h2>
          <Badge variant="secondary">Not shipped yet</Badge>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {ROADMAP.subtitle}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ROADMAP.items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-lg bg-card p-4 shadow-(--elevation-1)"
            >
              <h3 className="font-heading text-sm font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
