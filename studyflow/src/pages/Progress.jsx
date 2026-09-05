import React from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { useApp } from '../context/AppContext'
import { Card, ProgressBar } from '../components/ui'
import {
  weeklyStudyData,
  totalMinutes,
  weekOverWeekChange,
  overallTaskStats,
  studyStreak,
  courseProgress,
} from '../utils/derive'
import { formatMinutes } from '../utils/dateUtils'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-card">
      {label}: {formatMinutes(payload[0].value)}
    </div>
  )
}

export default function Progress() {
  const { tasks, studySessions, courses } = useApp()
  const data = weeklyStudyData(studySessions)
  const weekMinutes = totalMinutes(studySessions, 7)
  const wow = weekOverWeekChange(studySessions)
  const taskStats = overallTaskStats(tasks)
  const streak = studyStreak(studySessions)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-6">
      <h1 className="text-[26px] md:text-[28px] font-bold text-ink leading-tight mb-6">My Progress</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="p-5 md:col-span-1">
          <p className="text-sm font-medium text-ink-soft mb-2">This Week</p>
          <p className="text-3xl font-display font-semibold text-ink">{formatMinutes(weekMinutes)}</p>
          <p className={`text-xs font-medium mt-2 ${wow >= 0 ? 'text-success' : 'text-error'}`}>
            {wow >= 0 ? '+' : ''}{wow}% from last week
          </p>
        </Card>

        <Card className="p-5 md:col-span-2">
          <p className="text-sm font-medium text-ink-soft mb-3">Weekly Study Chart</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E8E8F0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#73738A' }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F7F7FB' }} />
                <Bar dataKey="minutes" fill="#635BFF" radius={[6, 6, 6, 6]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-sm font-medium text-ink-soft">Tasks Completed</p>
            <span className="text-sm font-semibold text-primary">{taskStats.percent}%</span>
          </div>
          <p className="text-2xl font-display font-semibold text-ink mb-3">
            {taskStats.done} / {taskStats.total}
          </p>
          <ProgressBar percent={taskStats.percent} />
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="text-4xl" aria-hidden="true">🔥</div>
          <div>
            <p className="text-lg font-bold text-ink">{streak} day study streak</p>
            <p className="text-sm text-ink-soft mt-0.5">
              {streak > 0 ? "You're building momentum!" : 'Start a session today to begin your streak.'}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <p className="text-sm font-medium text-ink-soft mb-4">Course Performance</p>
        <div className="flex flex-col gap-4">
          {courses.map((course) => {
            const { percent } = courseProgress(tasks, course.id)
            return (
              <div key={course.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-ink font-medium">{course.name}</span>
                  <span className="text-sm font-semibold" style={{ color: course.color }}>{percent}%</span>
                </div>
                <ProgressBar percent={percent} color={course.color} height={7} />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
