# Design System — "Rich Ledger, Editorial Discipline"

This is the single source of truth for where color, depth, motion, and glass
are allowed in the web app. Read it before making any UI change.

The system is a disciplined hybrid: expressive on hero/summary surfaces,
strictly restrained on dense data surfaces. The chrome is **neutral near-black
on a warm paper canvas** (hue 95) — not teal and not indigo. Note that
`AGENTS.md` and `.cursorrules` still describe a "teal / radix-lyra" chrome;
those references are stale and this document wins.

## Brand palette

Chrome carries no accent hue of its own: `--primary` is a near-black warm
neutral (`oklch(0.24 0.012 95)` in light mode, chroma ~0.012 at hue 95).
That leaves the five-color semantic system as the only color on screen, used
consistently for meaning and never decoration:

| Token         | Meaning                         | Hue family    |
| ------------- | ------------------------------- | ------------- |
| `--money-in`  | Sales, receipts, income         | Emerald green |
| `--money-out` | Purchases, payments, expenses   | Rose red      |
| `--gst`       | Tax / GST postings              | Violet        |
| `--inventory` | Stock / inventory               | Amber         |
| `--banking`   | Cash & bank (alias of `--info`) | Sky blue      |

Light-mode `--money-out` is deliberately darker than its dark-mode counterpart
(`oklch(0.54 0.24 17.585)`, down from `L=0.586`): the lighter rose cleared
4.5:1 on white but only reached 3.98:1 as `text-money-out` on a
`bg-money-out/15` badge, which is where the token is most often read.

Chart series (`--chart-1` … `--chart-5`) map 1:1 onto this palette, so a line
in a trend chart always carries the same meaning as the badge/icon used for it
elsewhere (e.g. sales is always emerald, purchases always rose).

## App shell

The shell is a **light inset canvas**: the sidebar sits flat on a shell tint
(`--shell-canvas`, equal to `--sidebar`) and the workspace floats above it as a
rounded, hairline-ringed card (`variant="inset"` on `<Sidebar>`). The chrome is
deliberately low-contrast so dense ledger data is the loudest thing on screen —
the sidebar is navigation, not decoration.

Nav active state uses `--sidebar-active` (a soft tint pill) with
`--sidebar-active-foreground`, never a saturated fill. A saturated nav pill
would read as one of the semantic colors below.

## One palette

There is a single palette — no brand-variant mechanism, no palette switcher.
Chrome values in `:root` and `.dark` are written as explicit `oklch(...)` at
hue 95; there is deliberately no brand-hue variable, so no token can silently
resolve against a hue nobody chose. The only theming axis is light/dark, driven
by the `.dark` class (see `src/features/app-shell/use-theme.ts`).

Do **not** promote a semantic hue to primary. Emerald already means money-in
and violet already means GST; reusing either as the nav/accent color destroys
the mapping in the table above.

## The hybrid rule (read this before styling anything)

**Hero/summary surfaces** — dashboard priority cards, empty states,
onboarding, confirmations/toasts — get the full "Rich Ledger" treatment:
saturated semantic color, duotone icons, the larger `--radius-hero` corner
radius, soft shadows, and expressive motion (spring easing, count-up numbers,
staggered first-paint reveal).

**Dense data surfaces** — tables, ledgers, voucher entry grids, list rows —
follow "Editorial Ledger" discipline: flat, hairline-ruled (`--radius`,
tightened to `0.5rem`), color only appears when it is a real signal (a status
badge, an overdue amount), motion is fast and precise (120–180ms, no bounce,
no stagger). Never wrap a table or voucher grid in a hero surface, glass
panel, or gradient.

The hairline discipline applies to the rules **inside** a surface — table row
and header rules, voucher grid cell borders, section dividers within a card.
It does not apply to the card container itself: every `Card` is borderless and
separated from the canvas by elevation (see below). The two do different jobs —
a container edge says "this is a separate object", an internal rule says "these
are separate records" — and only the second one is Editorial discipline.

This is enforced by the existing `[data-ui='chrome']` / `[data-ui='data']`
attribute convention in `src/styles.css` — chrome is where hero styling is
allowed, data is where it is forbidden.

## Radius scale

- `--radius` (`0.5rem`): default for inputs, buttons, dense cards, table
  cells — sharper than before, on purpose (Editorial discipline).
- `--radius-hero` (`1.125rem`): dashboard KPI/priority cards, empty states,
  onboarding panels only. Apply via the `[data-hero-surface]` attribute
  selector or `rounded-[var(--radius-hero)]`.

## Elevation

Card containers carry no border. Separation comes from a two-step elevation
scale defined once in `src/styles.css` — never hand-roll a `box-shadow`:

- `--elevation-1`: every `Card` (default and `size="sm"`), plus any other
  container-level surface that needs to lift off the canvas.
- `--elevation-2`: hero/summary surfaces only (`size="hero"`, which also picks
  up `--radius-hero`). Ordinary and hero cards must not sit at the same
  elevation, or the page flattens back out.

Each theme re-tints three inputs rather than redefining the scale:
`--elevation-key` (tight contact shadow), `--elevation-ambient` (wide soft
cast), and `--elevation-edge` (a 1px spread ring, transparent in light mode).

Because a shadow does almost nothing on a dark surface, the two modes reach
separation differently:

- **Light**: the canvas (`--workspace` / `--background`) is a hair off-white
  while `--card` stays pure white, so the card is already a distinct plane
  before the shadow is drawn; the shadow adds the lift.
- **Dark**: `--card` is lighter than `--background`, and `--elevation-edge`
  adds a faint top-light ring so large card edges stay crisp. This is edge
  lighting, not a reinstated border.

## Motion

Defined once as CSS custom properties so every component reads the same
values instead of inventing new numbers:

- `--duration-fast` (120ms) / `--duration-base` (180ms) / `--duration-spring`
  (220ms).
- `--ease-precise` — snappy, no overshoot. Use for dense-surface interactions
  (row hover, focus, table sort) and anything under `[data-ui='data']`.
- `--ease-spring` — slight overshoot. Use only for hero-surface state changes
  (panel open, KPI card mount, confirmation toasts).
- First-paint stagger (dashboard priority cards only): reveal cards in
  sequence via `animation-delay`, capped at ~240ms total so the page never
  feels slow. Respect `prefers-reduced-motion` (already handled globally in
  `src/styles.css`).
- Count-up KPI numbers (`<CountUpNumber>` in `src/components/ui/count-up.tsx`)
  animate value changes over ~700ms with a spring-style ease-out curve; they
  must never be used on dense table cells, only hero KPI cards.

## Glass / blur

Reserved for exactly four places — nowhere else:

1. Command palette (`CommandDialog`, built on `DialogContent`).
2. Modals and sheets (`DialogContent`, `SheetContent`).
3. Toasts (`.cn-toast`, via `sonner`).
4. The top app bar, only once the page has scrolled
   (`[data-app-header][data-scrolled='true']`).

Popovers, selects, and dropdown menus stay opaque — they're used constantly
inside dense forms and voucher grids, and blur there would hurt legibility
and perceived speed for no benefit.

## Icons

`lucide-react`, default single-stroke, everywhere **except** hero surfaces.
On hero surfaces (dashboard priority cards, empty states), icons use the
duotone treatment: a 16%-opacity fill in the semantic hue plus a solid stroke
in the same hue, applied with the `.icon-duotone` utility and the
`--icon-tone` custom property (see `src/styles.css`). Dense screens keep plain
single-color icons for scan speed.

## AI-ready surfaces

Planned assistive features — a natural-language command bar built on the
existing `⌘K` `CommandPalette`, inline account/GST-rate suggestions on voucher
entry, and anomaly badges on unusual postings — are backend/product work, not
visual-system work. When they land they must reuse what is defined above: the
semantic badge variants for anomaly flags and the existing dialog/confirmation
pattern for anything that would touch the ledger. No AI-suggested value may be
applied silently; the OCR rule of "reviewable drafts, never silent posting"
applies to all of them.
