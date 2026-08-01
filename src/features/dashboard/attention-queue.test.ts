import { describe, expect, test } from 'vitest'

import { buildAttentionQueue } from '#/features/dashboard/attention-queue.ts'
import type { AttentionQueueInput } from '#/features/dashboard/attention-queue.ts'
import type { Capability } from '#/features/companies/membership-service.ts'

const ownerCapabilities: Array<Capability> = [
  'manage_company',
  'manage_masters',
  'manage_inventory',
  'manage_gst',
  'post_sales',
  'post_purchase',
  'post_voucher',
  'post_payment',
  'reconcile_bank',
  'view_reports',
  'view_audit',
  'view',
]

function input(overrides: Partial<AttentionQueueInput> = {}): AttentionQueueInput {
  return {
    asOf: '2026-08-01',
    capabilities: ownerCapabilities,
    ...overrides,
  }
}

describe('attention queue ranking', () => {
  test('ranks money at risk above operational chores', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 3,
            outstandingAmount: '184000.00',
            maxDaysPastDue: 54,
          },
        ],
        lowStock: [
          {
            itemId: 'item-1',
            itemName: 'Copper Wire 2.5mm',
            availableQuantity: 8,
            reorderLevel: 25,
          },
        ],
        unreconciledBankCount: 12,
        ocrDraftCount: 4,
      }),
    )

    expect(items.map((item) => item.kind)).toEqual([
      'overdue-receivable',
      'low-stock',
      'unreconciled-bank',
      'ocr-draft',
    ])
    expect(items[0].title).toContain('Sharma Traders')
    expect(items[0].amount).toBe('184000.00')
    expect(items[0].tone).toBe('money-in')
    expect(items[0].to).toBe('/app/sales')
  })

  test('links carry a route path and structured search params', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 3,
            outstandingAmount: '184000.00',
            maxDaysPastDue: 54,
          },
        ],
        overduePayables: [
          {
            partyId: 'party-9',
            partyName: 'Metro Supplies',
            documentCount: 2,
            outstandingAmount: '77000.00',
            maxDaysPastDue: 18,
          },
        ],
        gst: { netPayableAmount: '58000.00', periodLabel: 'Jul 2026' },
        lowStock: [
          {
            itemId: 'item-1',
            itemName: 'Copper Wire 2.5mm',
            availableQuantity: 8,
            reorderLevel: 25,
          },
        ],
        unreconciledBankCount: 12,
      }),
    )

    const byKind = new Map(items.map((item) => [item.kind, item]))

    // The keys below must match each route's `validateSearch` schema: `party`
    // for the sales and purchase registers, `item` for inventory. A mismatch
    // navigates to an unfiltered list.
    expect(byKind.get('overdue-receivable')?.to).toBe('/app/sales')
    expect(byKind.get('overdue-receivable')?.search).toEqual({
      party: 'party-1',
    })
    expect(byKind.get('overdue-payable')?.to).toBe('/app/purchases')
    expect(byKind.get('overdue-payable')?.search).toEqual({ party: 'party-9' })
    expect(byKind.get('low-stock')?.to).toBe('/app/inventory')
    expect(byKind.get('low-stock')?.search).toEqual({ item: 'item-1' })

    // Destinations that take no params carry no `search` key at all, so the
    // component never passes an empty object into the router.
    expect(byKind.get('gst-due')?.to).toBe('/app/reports')
    expect('search' in (byKind.get('gst-due') ?? {})).toBe(false)
    expect(byKind.get('unreconciled-bank')?.to).toBe('/app/bank-reconciliation')
    expect('search' in (byKind.get('unreconciled-bank') ?? {})).toBe(false)
  })

  test('an item sitting exactly at its reorder level still raises a signal', () => {
    const items = buildAttentionQueue(
      input({
        lowStock: [
          {
            itemId: 'item-1',
            itemName: 'Copper Wire 2.5mm',
            availableQuantity: 25,
            reorderLevel: 25,
          },
        ],
      }),
    )

    expect(items.map((item) => item.kind)).toEqual(['low-stock'])
    expect(items[0].title).toBe('Copper Wire 2.5mm is below reorder level')
  })

  test('keeps only the six highest scoring items', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 2,
            outstandingAmount: '240000.00',
            maxDaysPastDue: 61,
          },
          {
            partyId: 'party-2',
            partyName: 'Nova Retail',
            documentCount: 1,
            outstandingAmount: '96000.00',
            maxDaysPastDue: 22,
          },
          {
            partyId: 'party-3',
            partyName: 'Kavi Enterprises',
            documentCount: 1,
            outstandingAmount: '31000.00',
            maxDaysPastDue: 9,
          },
        ],
        overduePayables: [
          {
            partyId: 'party-9',
            partyName: 'Metro Supplies',
            documentCount: 2,
            outstandingAmount: '77000.00',
            maxDaysPastDue: 18,
          },
        ],
        gst: {
          netPayableAmount: '58000.00',
          periodLabel: 'Jul 2026',
          filingDueDate: '2026-08-20',
        },
        lowStock: [
          {
            itemId: 'item-1',
            itemName: 'Copper Wire 2.5mm',
            availableQuantity: 0,
            reorderLevel: 25,
          },
        ],
        unreconciledBankCount: 12,
        ocrDraftCount: 4,
        pendingConversions: [{ kind: 'purchase-order', count: 3 }],
      }),
    )

    expect(items).toHaveLength(6)
    expect(items.map((item) => item.kind)).not.toContain('ocr-draft')
    expect(items.map((item) => item.kind)).not.toContain('pending-conversion')
  })

  test('an imminent GST filing outranks overdue receivables', () => {
    const gst = {
      netPayableAmount: '58000.00',
      periodLabel: 'Jul 2026',
      filingDueDate: '2026-08-03',
    }
    const overdueReceivables = [
      {
        partyId: 'party-1',
        partyName: 'Sharma Traders',
        documentCount: 3,
        outstandingAmount: '184000.00',
        maxDaysPastDue: 54,
      },
    ]

    const items = buildAttentionQueue(input({ gst, overdueReceivables }))

    expect(items.map((item) => item.kind)).toEqual([
      'gst-due',
      'overdue-receivable',
    ])
    expect(items[0].tone).toBe('gst')
    expect(items[0].title).toContain('Jul 2026')
  })

  test('a distant GST filing sits below overdue receivables', () => {
    const items = buildAttentionQueue(
      input({
        gst: {
          netPayableAmount: '58000.00',
          periodLabel: 'Jul 2026',
          filingDueDate: '2026-09-20',
        },
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 3,
            outstandingAmount: '184000.00',
            maxDaysPastDue: 54,
          },
        ],
      }),
    )

    expect(items.map((item) => item.kind)).toEqual([
      'overdue-receivable',
      'gst-due',
    ])
  })

  test('a GST filing with no due date sits low', () => {
    const items = buildAttentionQueue(
      input({
        gst: { netPayableAmount: '58000.00', periodLabel: 'Jul 2026' },
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Nova Retail',
            documentCount: 1,
            outstandingAmount: '4000.00',
            maxDaysPastDue: 2,
          },
        ],
      }),
    )

    expect(items.map((item) => item.kind)).toEqual([
      'overdue-receivable',
      'gst-due',
    ])
  })

  test('a large very overdue receivable outranks a small barely overdue one', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-small',
            partyName: 'Kavi Enterprises',
            documentCount: 1,
            outstandingAmount: '2400.00',
            maxDaysPastDue: 2,
          },
          {
            partyId: 'party-large',
            partyName: 'Sharma Traders',
            documentCount: 4,
            outstandingAmount: '640000.00',
            maxDaysPastDue: 88,
          },
        ],
      }),
    )

    expect(items.map((item) => item.id)).toEqual([
      'overdue-receivable:party-large',
      'overdue-receivable:party-small',
    ])
    expect(items[0].score).toBeGreaterThan(items[1].score)
  })

  test('stock at zero outranks a trivial money item', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Kavi Enterprises',
            documentCount: 1,
            outstandingAmount: '500.00',
            maxDaysPastDue: 1,
          },
        ],
        lowStock: [
          {
            itemId: 'item-1',
            itemName: 'Copper Wire 2.5mm',
            availableQuantity: 0,
            reorderLevel: 25,
          },
        ],
      }),
    )

    expect(items.map((item) => item.kind)).toEqual([
      'low-stock',
      'overdue-receivable',
    ])
    expect(items[0].tone).toBe('inventory')
  })

  test('shows rows the caller may read and marks only those they can act on', () => {
    const signals = {
      overdueReceivables: [
        {
          partyId: 'party-1',
          partyName: 'Sharma Traders',
          documentCount: 3,
          outstandingAmount: '184000.00',
          maxDaysPastDue: 54,
        },
      ],
      gst: {
        netPayableAmount: '58000.00',
        periodLabel: 'Jul 2026',
        filingDueDate: '2026-08-03',
      },
      lowStock: [
        {
          itemId: 'item-1',
          itemName: 'Copper Wire 2.5mm',
          availableQuantity: 0,
          reorderLevel: 25,
        },
      ],
      unreconciledBankCount: 12,
    }

    const inventoryStaff = buildAttentionQueue(
      input({ ...signals, capabilities: ['manage_inventory', 'view'] }),
    )
    expect(inventoryStaff.map((item) => item.kind)).toEqual([
      'low-stock',
      'unreconciled-bank',
    ])
    expect(inventoryStaff.map((item) => item.actionable)).toEqual([true, false])

    const billingStaff = buildAttentionQueue(
      input({ ...signals, capabilities: ['post_sales', 'post_payment', 'view'] }),
    )
    // Money rows need `view_reports`, mirroring the snapshot itself, which
    // withholds ageing and GST from callers lacking it.
    expect(billingStaff.map((item) => item.kind)).toEqual([
      'low-stock',
      'unreconciled-bank',
    ])

    const readonlyStaff = buildAttentionQueue(
      input({ ...signals, capabilities: ['view', 'view_reports'] }),
    )
    expect(readonlyStaff.map((item) => item.kind)).toEqual([
      'gst-due',
      'overdue-receivable',
      'low-stock',
      'unreconciled-bank',
    ])
    expect(readonlyStaff.some((item) => item.actionable)).toBe(false)

    const owner = buildAttentionQueue(input(signals))
    expect(owner.every((item) => item.actionable)).toBe(true)
  })

  test('returns an empty queue when there is nothing to act on', () => {
    expect(buildAttentionQueue(input())).toEqual([])
  })

  test('never fabricates an item from zero valued signals', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 0,
            outstandingAmount: '0.00',
            maxDaysPastDue: 0,
          },
        ],
        gst: { netPayableAmount: '0.00', periodLabel: 'Jul 2026' },
        lowStock: [
          {
            itemId: 'item-1',
            itemName: 'Copper Wire 2.5mm',
            availableQuantity: 40,
            reorderLevel: 25,
          },
        ],
        unreconciledBankCount: 0,
        ocrDraftCount: 0,
        pendingConversions: [{ kind: 'purchase-order', count: 0 }],
      }),
    )

    expect(items).toEqual([])
  })

  test('collapses several documents for one party into a single row', () => {
    const items = buildAttentionQueue(
      input({
        overdueReceivables: [
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 1,
            outstandingAmount: '40000.00',
            maxDaysPastDue: 12,
          },
          {
            partyId: 'party-1',
            partyName: 'Sharma Traders',
            documentCount: 2,
            outstandingAmount: '60000.00',
            maxDaysPastDue: 47,
          },
        ],
      }),
    )

    expect(items).toHaveLength(1)
    expect(items[0].amount).toBe('100000.00')
    expect(items[0].detail).toContain('3')
    expect(items[0].detail).toContain('47')
  })

  test('is deterministic and breaks ties on kind then id', () => {
    const queueInput = input({
      overdueReceivables: [
        {
          partyId: 'party-b',
          partyName: 'Beta Traders',
          documentCount: 1,
          outstandingAmount: '50000.00',
          maxDaysPastDue: 12,
        },
        {
          partyId: 'party-a',
          partyName: 'Alpha Traders',
          documentCount: 1,
          outstandingAmount: '50000.00',
          maxDaysPastDue: 12,
        },
      ],
      overduePayables: [
        {
          partyId: 'party-c',
          partyName: 'Metro Supplies',
          documentCount: 1,
          outstandingAmount: '50000.00',
          maxDaysPastDue: 12,
        },
      ],
    })

    const first = buildAttentionQueue(queueInput)
    const second = buildAttentionQueue(queueInput)

    expect(first.map((item) => item.score)).toEqual([
      first[0].score,
      first[0].score,
      first[0].score,
    ])
    expect(first.map((item) => item.id)).toEqual([
      'overdue-receivable:party-a',
      'overdue-receivable:party-b',
      'overdue-payable:party-c',
    ])
    expect(second).toEqual(first)
  })
})
