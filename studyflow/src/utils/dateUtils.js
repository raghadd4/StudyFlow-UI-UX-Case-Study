const MS_DAY = 24 * 60 * 60 * 1000

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function dayDiff(dateStr) {
  const today = startOfDay(new Date())
  const target = startOfDay(dateStr)
  return Math.round((target - today) / MS_DAY)
}

export function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// Returns a human label like "Today", "Tomorrow", "In 3 days", "Overdue · Sep 3"
export function dueLabel(dateStr, { completed = false } = {}) {
  const diff = dayDiff(dateStr)
  const short = formatShortDate(dateStr)
  if (completed) return `Completed ${short}`
  if (diff < 0) return `Overdue · ${short}`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff <= 6) return `In ${diff} days`
  return short
}

export function isOverdue(dateStr, completed) {
  return !completed && dayDiff(dateStr) < 0
}

export function isToday(dateStr) {
  return dayDiff(dateStr) === 0
}

export function isTomorrow(dateStr) {
  return dayDiff(dateStr) === 1
}

export function isThisWeek(dateStr) {
  const diff = dayDiff(dateStr)
  return diff >= 2 && diff <= 6
}

export function weekdayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

export function toDateInputValue(dateStr) {
  return new Date(dateStr).toISOString().slice(0, 10)
}

export function combineDateAndKeepTime(dateInputValue, originalIso) {
  const original = originalIso ? new Date(originalIso) : new Date()
  const [y, m, d] = dateInputValue.split('-').map(Number)
  const next = new Date(original)
  next.setFullYear(y, m - 1, d)
  return next.toISOString()
}

export function formatMinutes(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function relativeSessionDate(dateStr) {
  const diff = dayDiff(dateStr)
  if (diff === 0) return 'Today'
  if (diff === -1) return 'Yesterday'
  return formatShortDate(dateStr)
}
