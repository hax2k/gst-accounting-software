import Decimal from 'decimal.js'

export type StandingBalances = {
  cashBankBalance: string
  receivableTotal: string
  payableTotal: string
}

/**
 * What the business is worth right now on a cash-plus-parties basis: money
 * held, plus money owed to us, less money we owe. Derived here rather than in
 * the dashboard component so the arithmetic stays decimal-safe and testable,
 * and so it can move into the snapshot unchanged once `balances.netPosition`
 * exists server-side.
 */
export function computeNetPosition(balances: StandingBalances) {
  return new Decimal(balances.cashBankBalance)
    .plus(balances.receivableTotal)
    .minus(balances.payableTotal)
    .toFixed(2)
}
