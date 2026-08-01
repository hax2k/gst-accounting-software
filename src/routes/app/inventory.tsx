import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { InventoryPanel } from '#/features/inventory/components/inventory-panel.tsx'

const searchSchema = z.object({
  item: z.string().uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/app/inventory')({
  validateSearch: searchSchema,
  component: InventoryRoute,
})

function InventoryRoute() {
  const { item } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <InventoryPanel
      itemId={item}
      onClearItemFilter={() => void navigate({ search: {} })}
    />
  )
}
