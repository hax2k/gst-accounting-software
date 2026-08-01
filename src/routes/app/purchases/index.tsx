import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { PurchasesPanel } from '#/features/purchases/components/purchases-panel.tsx'

const searchSchema = z.object({
  party: z.string().uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/app/purchases/')({
  validateSearch: searchSchema,
  component: PurchasesIndexRoute,
})

function PurchasesIndexRoute() {
  const { party } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <PurchasesPanel
      onClearPartyFilter={() => void navigate({ search: {} })}
      partyId={party}
    />
  )
}
