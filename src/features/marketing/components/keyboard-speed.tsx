import { VoucherEntryPreview } from '#/features/marketing/components/product-preview.tsx'
import { KEYBOARD_SPEED } from '#/features/marketing/landing-content.ts'

export function KeyboardSpeed() {
  return (
    <section
      className="border-y border-border/70 bg-shell-canvas/40"
      data-ui="chrome"
      id={KEYBOARD_SPEED.id}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-20">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            {KEYBOARD_SPEED.title}
          </h2>
          <p className="text-muted-foreground">{KEYBOARD_SPEED.subtitle}</p>
          <ul className="flex flex-col gap-3">
            {KEYBOARD_SPEED.shortcuts.map((shortcut) => (
              <li
                key={shortcut.keys}
                className="flex items-center justify-between gap-4 rounded-md bg-card px-3 py-2.5 shadow-(--elevation-1)"
              >
                <span className="text-sm text-foreground">{shortcut.action}</span>
                <kbd className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
                  {shortcut.keys}
                </kbd>
              </li>
            ))}
          </ul>
        </div>
        <VoucherEntryPreview />
      </div>
    </section>
  )
}
