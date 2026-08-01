import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { SalesPanel } from '#/features/sales/components/sales-panel.tsx'

const searchSchema = z.object({
  party: z.string().uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/app/sales/')({
  validateSearch: searchSchema,
  component: SalesIndexRoute,
})

function SalesIndexRoute() {
  const { party } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <SalesPanel
      onClearPartyFilter={() => void navigate({ search: {} })}
      partyId={party}
    />
  )
}
