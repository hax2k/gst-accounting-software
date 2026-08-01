import { XIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'

/** Shows the deep-linked filter a list is currently narrowed to, with a way out. */
export function ActiveFilterChip({
  label,
  onClear,
}: {
  label: string
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Badge variant="secondary">{label}</Badge>
      <Button onClick={onClear} size="icon-sm" type="button" variant="ghost">
        <XIcon />
        <span className="sr-only">Clear {label} filter</span>
      </Button>
    </div>
  )
}
