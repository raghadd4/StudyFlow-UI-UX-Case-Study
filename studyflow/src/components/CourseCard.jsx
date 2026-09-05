import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Card, ProgressBar } from './ui'
import { courseProgress } from '../utils/derive'
import { useApp } from '../context/AppContext'

export default function CourseCard({ course }) {
  const { tasks } = useApp()
  const navigate = useNavigate()
  const { percent, done, total } = courseProgress(tasks, course.id)

  return (
    <Card
      as="button"
      hoverable
      onClick={() => navigate(`/courses/${course.id}`)}
      className="w-full text-left p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
            style={{ backgroundColor: course.color }}
          >
            {course.name[0]}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink truncate">{course.name}</p>
            <p className="text-xs text-ink-soft mt-0.5">{course.code}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-ink-soft shrink-0 mt-1" />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs text-ink-soft">
            {done} / {total} tasks completed
          </span>
          <span className="text-sm font-semibold" style={{ color: course.color }}>
            {percent}%
          </span>
        </div>
        <ProgressBar percent={percent} color={course.color} />
      </div>
    </Card>
  )
}
