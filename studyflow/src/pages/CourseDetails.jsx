import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock3, ListChecks } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, ProgressBar, IconButton, Badge } from '../components/ui'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import { courseProgress, tasksForCourse, studyMinutesForCourse } from '../utils/derive'
import { formatMinutes, relativeSessionDate } from '../utils/dateUtils'

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { courseById, tasks, studySessions } = useApp()
  const course = courseById(id)

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-10">
        <EmptyState emoji="🔍" title="Course not found" actionLabel="Back to courses" onAction={() => navigate('/courses')} />
      </div>
    )
  }

  const { percent, done, total } = courseProgress(tasks, course.id)
  const courseTasks = tasksForCourse(tasks, course.id)
  const upcomingTasks = courseTasks.filter((t) => !t.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  const weekMinutes = studyMinutesForCourse(studySessions, course.id, 7)
  const courseSessions = studySessions
    .filter((s) => s.courseId === course.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-6">
      <div className="flex items-center gap-3 mb-6">
        <IconButton icon={ArrowLeft} label="Back" variant="solid" onClick={() => navigate(-1)} />
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: course.color }}
          >
            {course.name[0]}
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-ink truncate">{course.name}</h1>
            <p className="text-xs text-ink-soft">{course.code} · {course.instructor}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-ink-soft">Progress</span>
            <span className="text-xl font-bold" style={{ color: course.color }}>{percent}%</span>
          </div>
          <ProgressBar percent={percent} color={course.color} className="mb-2" />
          <p className="text-xs text-ink-soft flex items-center gap-1">
            <ListChecks size={13} /> {done} / {total} tasks completed
          </p>
        </Card>
        <Card className="p-5">
          <span className="text-sm font-medium text-ink-soft">Study time</span>
          <p className="text-xl font-bold text-ink mt-2">{formatMinutes(weekMinutes)}</p>
          <p className="text-xs text-ink-soft flex items-center gap-1 mt-1">
            <Clock3 size={13} /> this week
          </p>
        </Card>
      </div>

      <section className="mb-6">
        <h2 className="text-base font-semibold text-ink mb-3">Upcoming Tasks</h2>
        {upcomingTasks.length === 0 ? (
          <Card className="p-0">
            <EmptyState emoji="✅" title="No open tasks" subtitle="This course is fully up to date." />
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {upcomingTasks.map((task) => (
              <TaskCard key={task.id} task={task} showCourse={false} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-base font-semibold text-ink mb-3">Recent Study Sessions</h2>
        {courseSessions.length === 0 ? (
          <Card className="p-0">
            <EmptyState emoji="⏱️" title="No sessions yet" subtitle="Start a focus session for this course." />
          </Card>
        ) : (
          <Card className="divide-y divide-border overflow-hidden">
            {courseSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{s.topic}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{relativeSessionDate(s.date)}</p>
                </div>
                <Badge tone="primary">{formatMinutes(s.durationMinutes)}</Badge>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  )
}
