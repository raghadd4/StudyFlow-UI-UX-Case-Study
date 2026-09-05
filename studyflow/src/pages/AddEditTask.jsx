import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Input, Select, Textarea, IconButton } from '../components/ui'
import { todayInputValue, toDateInputValue, combineDateAndKeepTime } from '../utils/dateUtils'

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function AddEditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { courses, addTask, updateTask, taskById, showToast } = useApp()
  const editing = Boolean(id)
  const existing = editing ? taskById(id) : null

  const [title, setTitle] = useState(existing?.title || '')
  const [courseId, setCourseId] = useState(existing?.courseId || courses[0]?.id || '')
  const [dueDate, setDueDate] = useState(existing ? toDateInputValue(existing.dueDate) : todayInputValue())
  const [priority, setPriority] = useState(existing?.priority || 'medium')
  const [estimateMinutes, setEstimateMinutes] = useState(existing?.estimateMinutes || 30)
  const [notes, setNotes] = useState(existing?.notes || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Give this task a name so you can find it later.')
      return
    }
    const isoDue = existing ? combineDateAndKeepTime(dueDate, existing.dueDate) : combineDateAndKeepTime(dueDate)
    const payload = { title: title.trim(), courseId, dueDate: isoDue, priority, estimateMinutes, notes: notes.trim() }

    if (editing) {
      updateTask(existing.id, payload)
      showToast('Task updated')
      navigate(`/tasks/${existing.id}`)
    } else {
      const created = addTask(payload)
      showToast('Task added')
      navigate(`/tasks/${created.id}`)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <IconButton icon={ArrowLeft} label="Back" variant="solid" onClick={() => navigate(-1)} />
        <h1 className="text-xl font-bold text-ink">{editing ? 'Edit Task' : 'Add Task'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Task name"
          placeholder="e.g. Complete Chapter 4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          autoFocus
        />

        <Select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div>
          <span className="block text-sm font-medium text-ink mb-1.5">Priority</span>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-colors duration-150 ${
                  priority === p.value
                    ? 'bg-primary-light border-primary text-primary'
                    : 'border-border text-ink-soft hover:border-primary/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-1.5">Estimated study time</span>
          <div className="flex items-center gap-4">
            <IconButton
              icon={Minus}
              label="Decrease estimate"
              variant="solid"
              onClick={() => setEstimateMinutes((m) => Math.max(5, m - 5))}
            />
            <span className="text-lg font-semibold text-ink w-16 text-center">{estimateMinutes}m</span>
            <IconButton
              icon={Plus}
              label="Increase estimate"
              variant="solid"
              onClick={() => setEstimateMinutes((m) => Math.min(240, m + 5))}
            />
          </div>
        </div>

        <Textarea
          label="Notes (optional)"
          placeholder="Anything you want to remember about this task"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" size="lg" className="w-full mt-2">
          Save Task
        </Button>
      </form>
    </div>
  )
}
