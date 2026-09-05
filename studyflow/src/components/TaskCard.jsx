import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { PriorityBadge } from './ui'
import { dueLabel, isOverdue } from '../utils/dateUtils'
import { useApp } from '../context/AppContext'

export default function TaskCard({ task, showCourse = true }) {
  const { courseById, toggleTaskComplete } = useApp()
  const navigate = useNavigate()
  const course = courseById(task.courseId)
  const overdue = isOverdue(task.dueDate, task.completed)

  const handleCheckbox = (e) => {
    e.stopPropagation()
    toggleTaskComplete(task.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/tasks/${task.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/tasks/${task.id}`)}
      className={`group flex items-center gap-3.5 bg-white border border-border rounded-2xl px-4 py-3.5 transition-all duration-150 hover:border-primary/30 hover:shadow-soft cursor-pointer ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={handleCheckbox}
        aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
        aria-pressed={task.completed}
        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
          task.completed ? 'bg-success border-success' : 'border-border hover:border-primary'
        }`}
      >
        {task.completed && (
          <svg className="animate-check-pop" width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-[15px] font-medium text-ink truncate ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-ink-soft">
          {showCourse && course && (
            <>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
              <span className="truncate">{course.name}</span>
              <span className="text-border">·</span>
            </>
          )}
          <span className={`flex items-center gap-1 shrink-0 ${overdue ? 'text-error font-medium' : ''}`}>
            <Clock size={12} />
            {dueLabel(task.dueDate, { completed: task.completed })}
          </span>
        </div>
      </div>

      {!task.completed && <PriorityBadge priority={task.priority} className="shrink-0" />}
    </div>
  )
}
