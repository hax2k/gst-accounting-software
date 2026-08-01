export type AgeingBucketLabel =
  | 'not-due'
  | '1-30'
  | '31-60'
  | '61-90'
  | '90+'

type AgeingBuckets = Record<AgeingBucketLabel, string>

export const AGEING_BUCKET_DISPLAY_LABEL: Record<AgeingBucketLabel, string> = {
  'not-due': 'Not due',
  '1-30': '1-30 days',
  '31-60': '31-60 days',
  '61-90': '61-90 days',
  '90+': '90+ days',
}

export type OwnerSnapshot = {
  asOfDate: string
  today: {
    salesTotal: string
    purchaseTotal: string
    moneyIn: string
    moneyOut: string
    expensesTotal: string
    netCashFlow: string
  }
  balances: {
    receivableTotal: string
    payableTotal: string
    cashBankBalance: string
  }
  /** Withheld for members without the `view_reports` capability. */
  ageing?: {
    receivables: AgeingBuckets
    payables: AgeingBuckets
  }
  overdue?: {
    invoiceCount: number
    billCount: number
  }
  monthCompare: {
    currentLabel: string
    previousLabel: string
    current: {
      salesTotal: string
      purchaseTotal: string
      expensesTotal: string
    }
    previous: {
      salesTotal: string
      purchaseTotal: string
      expensesTotal: string
    }
    change: {
      salesPercent: string
      purchasePercent: string
      expensesPercent: string
    }
  }
  /** Withheld for members without the `view_reports` capability. */
  gstMtd?: {
    periodStart: string
    periodEnd: string
    outwardTaxableValue: string
    outputGst: string
    inputGst: string
    netGstPayable: string
  }
}

export type DashboardMetric = {
  id: string
  label: string
  amount: string
  icon: 'trending-up-outline' | 'cash-outline' | 'arrow-down-outline' | 'arrow-up-outline' | 'wallet-outline'
}

export function mapOwnerSnapshotCards(snapshot: OwnerSnapshot) {
  return [
    { title: "Today's sales", amount: snapshot.today.salesTotal, badge: 'Sales' },
    {
      title: 'Receivables',
      amount: snapshot.balances.receivableTotal,
      badge: 'Due in',
    },
    {
      title: 'Payables',
      amount: snapshot.balances.payableTotal,
      badge: 'Outstanding',
    },
    {
      title: 'Cash & bank',
      amount: snapshot.balances.cashBankBalance,
      badge: 'Balance',
    },
  ]
}

export function mapOwnerSnapshotMetrics(snapshot: OwnerSnapshot): Array<DashboardMetric> {
  return [
    {
      id: 'sales',
      label: 'Sales',
      amount: snapshot.today.salesTotal,
      icon: 'trending-up-outline',
    },
    {
      id: 'receipts',
      label: 'Receipts',
      amount: snapshot.today.moneyIn,
      icon: 'cash-outline',
    },
    {
      id: 'receivables',
      label: 'Receivables',
      amount: snapshot.balances.receivableTotal,
      icon: 'arrow-down-outline',
    },
    {
      id: 'payables',
      label: 'Payables',
      amount: snapshot.balances.payableTotal,
      icon: 'arrow-up-outline',
    },
    {
      id: 'cash',
      label: 'Cash & bank',
      amount: snapshot.balances.cashBankBalance,
      icon: 'wallet-outline',
    },
  ]
}

/** Overdue is every bucket except `not-due`: one day late already counts. */
function sumAgeingOverdue(buckets: AgeingBuckets | undefined) {
  if (!buckets) return 0
  return (
    Number(buckets['1-30']) +
    Number(buckets['31-60']) +
    Number(buckets['61-90']) +
    Number(buckets['90+'])
  )
}

export function getOverdueTotals(snapshot: OwnerSnapshot) {
  return {
    receivables: sumAgeingOverdue(snapshot.ageing?.receivables),
    payables: sumAgeingOverdue(snapshot.ageing?.payables),
  }
}

export function getOverdueCounts(snapshot: OwnerSnapshot) {
  return {
    invoices: snapshot.overdue?.invoiceCount ?? 0,
    bills: snapshot.overdue?.billCount ?? 0,
  }
}

export function formatDashboardDate(date: string) {
  const value = new Date(`${date}T12:00:00`)
  return value.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
