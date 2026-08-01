/** A record a deep-linked list filter can point at, reduced to id and label. */
export type ListFilterRecord = {
  id: string
  label: string
}

export type ResolvedListFilter = {
  /** The id to filter by, or `undefined` to show the unfiltered list. */
  id?: string
  /** Display name for the active-filter chip, once the record is known. */
  label?: string
}

/**
 * Resolves a deep-linked id (for example `?party=<uuid>` from the dashboard
 * attention queue) against the records a panel has loaded.
 *
 * An id that matches nothing once the records have loaded is dropped, so a
 * stale or hand-edited link falls back to the full list rather than an empty
 * one. While the records are still loading the id is kept, so the filter is
 * applied on the first render instead of flashing the unfiltered list.
 */
export function resolveListFilter(
  id: string | undefined,
  records: ReadonlyArray<ListFilterRecord>,
  recordsLoaded: boolean,
): ResolvedListFilter {
  if (!id) return {}

  const match = records.find((record) => record.id === id)
  if (match) return { id, label: match.label }

  return recordsLoaded ? {} : { id }
}
