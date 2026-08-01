import type { OwnerDashboardSnapshot } from '#/features/dashboard/dashboard-owner-service.ts'

/**
 * Presentation decisions for the owner dashboard that are really judgements
 * about the data: which figures carry a signal, and when a comparison window
 * is too degenerate to be worth captioning. Kept out of the component so the
 * rules are testable and the same everywhere.
 */

export type MonthFigureKey = 'sales' | 'purchases' | 'expenses'

export type MonthFigureChange = {
  direction: 'up' | 'down'
  label: string
}

export type MonthFigure = {
  key: MonthFigureKey
  label: string
  value: string
  /** Absent when nothing moved — a row of identical "No change" chips is noise. */
  change?: MonthFigureChange
}

export type MonthCompareView = {
  figures: Array<MonthFigure>
  /** Absent when no figure moved, so the window is never named for nothing. */
  caption?: string
}

const RANGE_SEPARATOR = ' – '

function toAmount(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/** `1 Jul – 1 Jul` is a date dressed up as a range; say it once instead. */
export function collapseRangeLabel(label: string) {
  const [start, end] = label.split(RANGE_SEPARATOR)
  return end && start === end ? start : label
}

function toChange(percent: string): MonthFigureChange | undefined {
  const value = toAmount(percent)
  if (value === 0) return undefined
  return {
    direction: value > 0 ? 'up' : 'down',
    label: `${value > 0 ? '+' : ''}${percent}%`,
  }
}

export function buildMonthCompareView(
  monthCompare: OwnerDashboardSnapshot['monthCompare'],
): MonthCompareView {
  const figures: Array<MonthFigure> = [
    {
      key: 'sales',
      label: 'Sales',
      value: monthCompare.current.salesTotal,
      change: toChange(monthCompare.change.salesPercent),
    },
    {
      key: 'purchases',
      label: 'Purchases',
      value: monthCompare.current.purchaseTotal,
      change: toChange(monthCompare.change.purchasePercent),
    },
    {
      key: 'expenses',
      label: 'Expenses',
      value: monthCompare.current.expensesTotal,
      change: toChange(monthCompare.change.expensesPercent),
    },
  ]

  const moved = figures.some((figure) => figure.change)

  return {
    figures,
    ...(moved
      ? { caption: `vs ${collapseRangeLabel(monthCompare.previousLabel)}` }
      : {}),
  }
}

/** An all-zero window renders as bare gridlines, which reads as broken. */
export function hasTrendActivity(trend: OwnerDashboardSnapshot['trend']) {
  return trend.some(
    (day) => toAmount(day.sales) !== 0 || toAmount(day.purchases) !== 0,
  )
}

/**
 * Whether the selected day has anything at all to report. Cash movement counts
 * even without a document, because a receipt against an older invoice is still
 * something that happened.
 */
export function isQuietDay(
  snapshot: Pick<
    OwnerDashboardSnapshot,
    'today' | 'dueToday' | 'todayExpenses'
  >,
) {
  const { today } = snapshot
  const amounts = [
    today.salesTotal,
    today.purchaseTotal,
    today.expensesTotal,
    today.moneyIn,
    today.moneyOut,
  ]

  return (
    amounts.every((amount) => toAmount(amount) === 0) &&
    snapshot.dueToday.receivables.length === 0 &&
    snapshot.dueToday.payables.length === 0 &&
    snapshot.todayExpenses.length === 0
  )
}

/**
 * Whether the company has nothing on its books at all, as distinct from
 * nothing inside the window on screen. Only the second one deserves a
 * per-card empty state; the first collapses the page into a single first-run
 * card instead of five ways of saying "no data".
 */
export function isFirstRun(snapshot: OwnerDashboardSnapshot) {
  const { balances, monthCompare, overdue } = snapshot
  const amounts = [
    balances.cashBankBalance,
    balances.receivableTotal,
    balances.payableTotal,
    monthCompare.current.salesTotal,
    monthCompare.current.purchaseTotal,
    monthCompare.current.expensesTotal,
    monthCompare.previous.salesTotal,
    monthCompare.previous.purchaseTotal,
    monthCompare.previous.expensesTotal,
  ]

  return (
    amounts.every((amount) => toAmount(amount) === 0) &&
    overdue.invoiceCount === 0 &&
    overdue.billCount === 0 &&
    snapshot.attention.length === 0 &&
    !hasTrendActivity(snapshot.trend) &&
    isQuietDay(snapshot)
  )
}
