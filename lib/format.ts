const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const date = new Intl.DateTimeFormat(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })
const longDate = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
const full = new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short' })
const monthYear = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

const startOfDay = (ts: number) => {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const isSameDay = (a: number, b: number) => startOfDay(a) === startOfDay(b)

/** "Today at 7:09 PM", "Yesterday at 7:09 PM" or "09/28/2026 7:09 PM" */
export const formatTimestamp = (ts: number, now = Date.now()) => {
  const days = Math.round((startOfDay(now) - startOfDay(ts)) / 86_400_000)
  if (days === 0) return `Today at ${time.format(ts)}`
  if (days === 1) return `Yesterday at ${time.format(ts)}`
  return `${date.format(ts)} ${time.format(ts)}`
}

export const formatTime = (ts: number) => time.format(ts)
export const formatDateDivider = (ts: number) => longDate.format(ts)
export const formatFull = (ts: number) => full.format(ts)
export const formatShortDate = (ts: number) => monthYear.format(ts)
