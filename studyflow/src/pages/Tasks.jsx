import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowDownUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SegmentedTabs, Button } from '../components/ui'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import { isToday, isTomorrow, isThisWeek, isOverdue } from '../utils/dateUtils'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

export default function Tasks() {
  const { tasks, courses } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [sort, setSort] = useState('due')

  const filtered = useMemo(() => {
    let list = [...tasks]
    if (tab === 'today') list = list.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed)))
    if (tab === 'upcoming') list = list.filter((t) => !t.completed && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.completed))
    if (tab === 'completed') list = list.filter((t) => t.completed)

    if (courseFilter !== 'all') list = list.filter((t) => t.courseId === courseFilter)
    if (query.trim()) list = list.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase()))

    list.sort((a, b) => {
      if (sort === 'due') return new Date(a.dueDate) - new Date(b.dueDate)
      if (sort === 'priority') {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      if (sort === 'title') return a.title.localeCompare(b.title)
      return 0
    })
    return list
  }, [tasks, tab, query, courseFilter, sort])

  const counts = {
    all: tasks.length,
    today: tasks.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed))).length,
    upcoming: tasks.filter((t) => !t.completed && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.completed)).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  const groups = useMemo(() => {
    if (tab === 'completed' || tab === 'today') return [{ label: null, items: filtered }]
    const overdue = filtered.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed))
    const today = filtered.filter((t) => !t.completed && isToday(t.dueDate))
    const tomorrow = filtered.filter((t) => !t.completed && isTomorrow(t.dueDate))
    const thisWeek = filtered.filter((t) => !t.completed && isThisWeek(t.dueDate))
    const later = filtered.filter(
      (t) => !t.completed && !isOverdue(t.dueDate, t.completed) && !isToday(t.dueDate) && !isTomorrow(t.dueDate) && !isThisWeek(t.dueDate)
    )
    const completedDone = filtered.filter((t) => t.completed)
    return [
      { label: 'Overdue', items: overdue },
      { label: 'Today', items: today },
      { label: 'Tomorrow', items: tomorrow },
      { label: 'This Week', items: thisWeek },
      { label: 'Later', items: later },
      { label: 'Completed', items: completedDone },
    ].filter((g) => g.items.length > 0)
  }, [filtered, tab])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[26px] md:text-[28px] font-bold text-ink leading-tight">My Tasks</h1>
        <Button className="hidden sm:inline-flex" onClick={() => navigate('/tasks/new')}>
          Add Task
        </Button>
      </div>
      <p className="text-ink-soft text-[15px] mt-1 mb-5">Everything you need to get done, grouped and sorted.</p>

      <SegmentedTabs
        tabs={TABS.map((t) => ({ ...t, count: counts[t.value] }))}
        active={tab}
        onChange={setTab}
        className="mb-4 w-full sm:w-auto overflow-x-auto no-scrollbar"
      />

      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex gap-2.5">
          <div className="relative flex-1 sm:flex-none">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              aria-label="Filter by course"
              className="pl-8 pr-7 py-2.5 rounded-xl border border-border bg-white text-sm outline-none focus:border-primary appearance-none w-full"
            >
              <option value="all">All courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <ArrowDownUp size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort tasks"
              className="pl-8 pr-7 py-2.5 rounded-xl border border-border bg-white text-sm outline-none focus:border-primary appearance-none w-full"
            >
              <option value="due">Sort: Due date</option>
              <option value="priority">Sort: Priority</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🗂️"
          title="No matching tasks"
          subtitle="Try a different search term or filter."
          actionLabel="Add a task"
          onAction={() => navigate('/tasks/new')}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.label || 'flat'}>
              {group.label && (
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2.5">
                  {group.label} <span className="text-ink-soft/60 normal-case">({group.items.length})</span>
                </h3>
              )}
              <div className="flex flex-col gap-2.5">
                {group.items.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/tasks/new')}
        className="sm:hidden fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary text-white shadow-pop flex items-center justify-center text-2xl font-light"
        aria-label="Add task"
      >
        +
      </button>
    </div>
  )
}
