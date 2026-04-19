import { ScheduleType } from './types'

export const SCHEDULE_TABS: { label: string; value: ScheduleType }[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom Dates', value: 'custom' },
]

export const DAY_LABELS: { label: string; short: string; value: number }[] = [
  { label: 'Sunday', short: 'Sun', value: 0 },
  { label: 'Monday', short: 'Mon', value: 1 },
  { label: 'Tuesday', short: 'Tue', value: 2 },
  { label: 'Wednesday', short: 'Wed', value: 3 },
  { label: 'Thursday', short: 'Thu', value: 4 },
  { label: 'Friday', short: 'Fri', value: 5 },
  { label: 'Saturday', short: 'Sat', value: 6 },
]

export const DAY_OF_MONTH_OPTIONS: { label: string; value: number }[] = Array.from(
  { length: 31 },
  (_, i) => ({
    value: i + 1,
    label:
      i + 1 === 1
        ? '1st'
        : i + 1 === 2
        ? '2nd'
        : i + 1 === 3
        ? '3rd'
        : `${i + 1}th`,
  })
)

/** Returns the next `count` months starting from the current month as 'YYYY-MM' strings. */
export const getUpcomingMonths = (count = 12): { label: string; value: string }[] => {
  const now = new Date()
  const results: { label: string; value: string }[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    results.push({ label, value })
  }
  return results
}

export const MONTH_SHORT: string[] = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
