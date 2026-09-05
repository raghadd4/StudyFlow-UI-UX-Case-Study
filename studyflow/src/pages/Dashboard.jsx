import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ArrowRight, Play, CalendarClock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, Button, ProgressBar } from '../components/ui'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import { isToday, isOverdue, dueLabel, formatShortDate } from '../utils/dateUtils'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { tasks, profile, courseById } = useApp()
  const navigate = useNavigate()

  const todaysTasks = useMemo(
    () => tasks.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed))),
    [tasks]
  )
  const doneToday = useMemo(
    () => tasks.filter((t) => t.completed && t.completedAt && isToday(t.completedAt)).length,
    [tasks]
  )
  const totalTodayTarget = todaysTasks.length + doneToday
  const percentToday = totalTodayTarget ? Math.round((doneToday / totalTodayTarget) * 100) : 0

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.completed))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3),
    [tasks]
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-ink leading-tight">
            {greeting()}, {profile.name} 👋
          </h1>
          <p className="text-ink-soft text-[15px] mt-1">Ready to make progress today?</p>
        </div>
        <button
          aria-label="Notifications"
          className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shrink-0 hover:border-primary/30 transition-colors"
        >
          <Bell size={18} className="text-ink-soft" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        {/* Left / main column */}
        <div className="md:col-span-2 flex flex-col gap-5">
          {/* Today's progress card */}
          <Card className="p-5 md:p-6 bg-gradient-to-br from-primary to-[#7A6FFF] border-none text-white">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-white/80">Today's Progress</p>
            </div>
            <p className="text-2xl font-display font-semibold mb-4">
              {doneToday} / {totalTodayTarget || 0} tasks completed
            </p>
            <ProgressBar percent={percentToday} color="#FFFFFF" trackClassName="!bg-white/25" height={9} />
            <p className="text-sm text-white/85 mt-3">
              {percentToday === 100 && totalTodayTarget > 0
                ? "All done for today — nicely played."
                : "Keep going! You're doing great."}
            </p>
          </Card>

          {/* Today's tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-ink">Today's Tasks</h2>
              <button
                onClick={() => navigate('/tasks')}
                className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                See all <ArrowRight size={14} />
              </button>
            </div>
            {todaysTasks.length === 0 ? (
              <Card className="p-0">
                <EmptyState
                  emoji="🎉"
                  title="You're all caught up!"
                  subtitle="No tasks for today."
                  actionLabel="Add a task"
                  onAction={() => navigate('/tasks/new')}
                />
              </Card>
            ) : (
              <div className="flex flex-col gap-2.5">
                {todaysTasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Quick study card */}
          <Card className="p-5">
            <p className="text-sm font-semibold text-ink mb-1">Ready to study?</p>
            <p className="text-xs text-ink-soft mb-4">25 min focus session</p>
            <Button className="w-full" icon={Play} onClick={() => navigate('/study')}>
              Start Session
            </Button>
          </Card>

          {/* Upcoming deadlines */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink">Upcoming Deadlines</h3>
              <CalendarClock size={16} className="text-ink-soft" />
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-ink-soft py-2">Nothing on the horizon. Enjoy the breathing room.</p>
            ) : (
              <ol className="relative flex flex-col gap-4 pl-4 before:absolute before:left-[3px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-border">
                {upcoming.map((task) => {
                  const course = courseById(task.courseId)
                  return (
                    <li key={task.id} className="relative">
                      <span
                        className="absolute -left-4 top-1 w-2 h-2 rounded-full ring-4 ring-white"
                        style={{ backgroundColor: course?.color || '#635BFF' }}
                      />
                      <button
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="text-left w-full group"
                      >
                        <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-ink-soft mt-0.5">
                          Due {formatShortDate(task.dueDate)} · {dueLabel(task.dueDate)}
                        </p>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
