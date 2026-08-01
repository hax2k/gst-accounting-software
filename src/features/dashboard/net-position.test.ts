import { describe, expect, test } from 'vitest'

import { computeNetPosition } from '#/features/dashboard/net-position.ts'

describe('computeNetPosition', () => {
  test('adds what is owed to us to cash and subtracts what we owe', () => {
    expect(
      computeNetPosition({
        cashBankBalance: '125000.00',
        receivableTotal: '84000.50',
        payableTotal: '39000.25',
      }),
    ).toBe('170000.25')
  })

  test('keeps decimal precision instead of drifting like floats', () => {
    expect(
      computeNetPosition({
        cashBankBalance: '0.10',
        receivableTotal: '0.20',
        payableTotal: '0.00',
      }),
    ).toBe('0.30')
  })

  test('returns a negative position when liabilities exceed assets', () => {
    expect(
      computeNetPosition({
        cashBankBalance: '1000.00',
        receivableTotal: '500.00',
        payableTotal: '2500.00',
      }),
    ).toBe('-1000.00')
  })
})
