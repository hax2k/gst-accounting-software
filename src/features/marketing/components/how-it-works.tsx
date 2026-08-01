import { HOW_IT_WORKS } from '#/features/marketing/landing-content.ts'

export function HowItWorks() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 md:py-20"
      data-ui="chrome"
      id={HOW_IT_WORKS.id}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {HOW_IT_WORKS.title}
        </h2>
        <p className="text-muted-foreground">{HOW_IT_WORKS.subtitle}</p>
      </div>
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {HOW_IT_WORKS.steps.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-3 rounded-[var(--radius-hero)] bg-card p-5 shadow-(--elevation-2)"
            data-hero-surface=""
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-base font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
