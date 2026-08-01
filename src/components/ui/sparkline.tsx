import * as React from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { cn } from '#/lib/utils.ts'

function Sparkline({
  data,
  tone = 'var(--primary)',
  className,
}: {
  data: Array<number>
  tone?: string
  className?: string
}) {
  const gradientId = `sparkline-${React.useId().replace(/:/g, '')}`
  const points = data.map((value) => ({ value }))

  return (
    <div className={cn('h-8 w-full', className)} data-slot="sparkline">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={points}
          margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={tone} stopOpacity={0.35} />
              <stop offset="100%" stopColor={tone} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            stroke={tone}
            strokeWidth={1.5}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { Sparkline }
