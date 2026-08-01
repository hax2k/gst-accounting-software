import { describe, expect, test } from 'vitest'

import { resolveListFilter } from '#/features/app-shell/list-filter.ts'

const records = [
  { id: 'party-1', label: 'Sharma Traders' },
  { id: 'party-2', label: 'Verma Steels' },
]

describe('resolveListFilter', () => {
  test('returns no filter when no id is deep-linked', () => {
    expect(resolveListFilter(undefined, records, true)).toEqual({})
  })

  test('labels a filter that matches a loaded record', () => {
    expect(resolveListFilter('party-2', records, true)).toEqual({
      id: 'party-2',
      label: 'Verma Steels',
    })
  })

  test('drops an id that matches nothing once records have loaded', () => {
    expect(resolveListFilter('party-9', records, true)).toEqual({})
  })

  test('keeps an unmatched id while records are still loading', () => {
    expect(resolveListFilter('party-9', [], false)).toEqual({ id: 'party-9' })
  })
})
