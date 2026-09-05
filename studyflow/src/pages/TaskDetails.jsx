import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Pencil, Play, CheckCircle2, Clock, FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, Button, IconButton, PriorityBadge } from '../components/ui'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { dueLabel, isOverdue, formatMinutes, formatShortDate, formatTime } from '../utils/dateUtils'

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { taskById, courseById, toggleTaskComplete, deleteTask, showToast } = useApp()
  const task = taskById(id)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <EmptyState emoji="🔍" title="Task not found" actionLabel="Back to tasks" onAction={() => navigate('/tasks')} />
      </div>
    )
  }

  const course = courseById(task.courseId)
  const overdue = isOverdue(task.dueDate, task.completed)

  const handleComplete = () => {
    toggleTaskComplete(task.id)
    showToast(task.completed ? 'Task marked as not completed' : 'Task completed — nice work!')
  }

  const handleDelete = () => {
    deleteTask(task.id)
    showToast('Task deleted', 'info')
    navigate('/tasks')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-10">
      <div className="flex items-center justify-between mb-6">
        <IconButton icon={ArrowLeft} label="Back" variant="solid" onClick={() => navigate(-1)} />
        <div className="flex gap-2">
          <IconButton icon={Pencil} label="Edit task" variant="solid" onClick={() => navigate(`/tasks/${task.id}/edit`)} />
          <IconButton icon={Trash2} label="Delete task" variant="solid" className="hover:!border-error/40 hover:!text-error" onClick={() => setConfirmDelete(true)} />
        </div>
      </div>

      <Card className="p-5 md:p-6 mb-5">
        {task.completed && (
          <div className="flex items-center gap-2 text-success text-sm font-medium mb-4">
            <CheckCircle2 size={16} />
            Completed {task.completedAt && `· ${formatShortDate(task.completedAt)} at ${formatTime(task.completedAt)}`}
          </div>
        )}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className={`text-xl font-bold text-ink ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</h1>
          <PriorityBadge priority={task.priority} className="shrink-0 mt-1" />
        </div>
        {course && (
          <div className="flex items-center gap-1.5 text-sm text-ink-soft mb-5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} />
            {course.name}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border">
          <div>
            <p className="text-xs text-ink-soft mb-1">Due date</p>
            <p className={`text-sm font-medium flex items-center gap-1.5 ${overdue ? 'text-error' : 'text-ink'}`}>
              <Clock size={14} />
              {dueLabel(task.dueDate, { completed: task.completed })}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-soft mb-1">Estimated time</p>
            <p className="text-sm font-medium text-ink">{formatMinutes(task.estimateMinutes)}</p>
          </div>
        </div>

        {task.notes && (
          <div className="mt-4">
            <p className="text-xs text-ink-soft mb-1.5 flex items-center gap-1.5"><FileText size={13} /> Notes</p>
            <p className="text-sm text-ink leading-relaxed">{task.notes}</p>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-2.5">
        {!task.completed && (
          <Button size="lg" icon={Play} onClick={() => navigate('/study', { state: { courseId: task.courseId, taskId: task.id } })}>
            Start Study Session
          </Button>
        )}
        <Button size="lg" variant={task.completed ? 'outline' : 'secondary'} icon={CheckCircle2} onClick={handleComplete}>
          {task.completed ? 'Mark as Not Completed' : 'Mark as Completed'}
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this task?"
        footer={
          <div className="flex gap-2.5 justify-end">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete task</Button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">This can't be undone. "{task.title}" will be permanently removed.</p>
      </Modal>
    </div>
  )
}
