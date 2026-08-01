import { describe, expect, test } from 'vitest'

import { moneyTone } from '#/features/dashboard/money-tone.ts'

describe('moneyTone', () => {
  test('drops the tone for a zero', () => {
    expect(moneyTone(0, 'text-money-in')).toBe('text-foreground')
  })

  test('drops the tone for a zero written as a decimal string', () => {
    expect(moneyTone('0.00', 'text-money-out')).toBe('text-foreground')
  })

  test('drops the tone for negative zero', () => {
    expect(moneyTone(-0, 'text-money-in')).toBe('text-foreground')
  })

  test('keeps the tone for a positive amount', () => {
    expect(moneyTone('84000.50', 'text-money-in')).toBe('text-money-in')
  })

  test('keeps the tone for a negative amount', () => {
    expect(moneyTone('-1000.00', 'text-money-out')).toBe('text-money-out')
  })

  test('falls back to the neutral tone for a missing amount', () => {
    expect(moneyTone(null, 'text-money-in')).toBe('text-foreground')
    expect(moneyTone(undefined, 'text-money-out')).toBe('text-foreground')
  })

  test('falls back to the neutral tone for an unparseable amount', () => {
    expect(moneyTone('', 'text-money-in')).toBe('text-foreground')
    expect(moneyTone('n/a', 'text-money-in')).toBe('text-foreground')
  })
})
