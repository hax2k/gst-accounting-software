import * as React from 'react'

function useCountUp(value: number, durationMs = 700) {
  const [display, setDisplay] = React.useState(value)
  const fromRef = React.useRef(value)

  React.useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplay(value)
      fromRef.current = value
      return
    }

    const from = fromRef.current
    const to = value
    if (from === to) return

    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(from + (to - from) * eased)
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, durationMs])

  return display
}

function defaultFormat(value: number) {
  return Math.round(value).toLocaleString('en-IN')
}

function CountUpNumber({
  value,
  format = defaultFormat,
  durationMs = 700,
  className,
}: {
  value: number
  format?: (value: number) => string
  durationMs?: number
  className?: string
}) {
  const display = useCountUp(value, durationMs)
  return (
    <span className={className} data-slot="count-up">
      {format(display)}
    </span>
  )
}

export { CountUpNumber, useCountUp }
