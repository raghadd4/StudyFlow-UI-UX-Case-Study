import { dayDiff, weekdayLabel } from './dateUtils'

export function tasksForCourse(tasks, courseId) {
  return tasks.filter((t) => t.courseId === courseId)
}

export function courseProgress(tasks, courseId) {
  const list = tasksForCourse(tasks, courseId)
  if (list.length === 0) return { percent: 0, done: 0, total: 0 }
  const done = list.filter((t) => t.completed).length
  return { percent: Math.round((done / list.length) * 100), done, total: list.length }
}

export function studyMinutesForCourse(sessions, courseId, sinceDays = null) {
  return sessions
    .filter((s) => s.courseId === courseId && (sinceDays == null || dayDiff(s.date) > -sinceDays))
    .reduce((sum, s) => sum + s.durationMinutes, 0)
}

// Last 7 days (Mon..Sun aligned to "today - 6" .. "today")
export function weeklyStudyData(sessions) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days.map((d) => {
    const key = d.toDateString()
    const minutes = sessions
      .filter((s) => new Date(s.date).toDateString() === key)
      .reduce((sum, s) => sum + s.durationMinutes, 0)
    return { day: weekdayLabel(d), fullDate: d, minutes, hours: +(minutes / 60).toFixed(2) }
  })
}

export function totalMinutes(sessions, sinceDays = null) {
  return sessions
    .filter((s) => sinceDays == null || dayDiff(s.date) > -sinceDays)
    .reduce((sum, s) => sum + s.durationMinutes, 0)
}

export function weekOverWeekChange(sessions) {
  const thisWeek = totalMinutes(sessions, 7)
  const lastWeek = sessions
    .filter((s) => dayDiff(s.date) <= -7 && dayDiff(s.date) > -14)
    .reduce((sum, s) => sum + s.durationMinutes, 0)
  if (lastWeek === 0) return thisWeek > 0 ? 100 : 0
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
}

export function studyStreak(sessions) {
  if (sessions.length === 0) return 0
  const daysWithSessions = new Set(sessions.map((s) => new Date(s.date).toDateString()))
  let streak = 0
  let cursor = new Date()
  // If nothing studied today yet, streak can still count from yesterday backward
  if (!daysWithSessions.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (daysWithSessions.has(cursor.toDateString())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function overallTaskStats(tasks) {
  const total = tasks.length
  const done = tasks.filter((t) => t.completed).length
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}
