import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedCourses, seedTasks, seedStudySessions, defaultProfile } from '../data/seedData'

const AppContext = createContext(null)

let idCounter = 0
function makeId(prefix) {
  idCounter += 1
  return `${prefix}_${Date.now().toString(36)}${idCounter}`
}

export function AppProvider({ children }) {
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('sf_onboarding', false)
  const [courses, setCourses] = useLocalStorage('sf_courses', seedCourses)
  const [tasks, setTasks] = useLocalStorage('sf_tasks', seedTasks)
  const [studySessions, setStudySessions] = useLocalStorage('sf_sessions', seedStudySessions)
  const [profile, setProfile] = useLocalStorage('sf_profile', defaultProfile)

  const [toasts, setToasts] = useState([])
  const [activeSession, setActiveSession] = useState(null) // { courseId, taskId, totalSeconds, remainingSeconds, status: 'running'|'paused'|'finished' }

  const showToast = useCallback((message, type = 'success') => {
    const id = makeId('toast')
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ---------- Tasks ----------
  const addTask = useCallback((task) => {
    const newTask = {
      id: makeId('t'),
      title: task.title,
      courseId: task.courseId,
      dueDate: task.dueDate,
      priority: task.priority || 'medium',
      estimateMinutes: task.estimateMinutes || 30,
      notes: task.notes || '',
      completed: false,
      completedAt: null,
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }, [setTasks])

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [setTasks])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [setTasks])

  const toggleTaskComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
          : t
      )
    )
  }, [setTasks])

  // ---------- Study sessions ----------
  const startSession = useCallback(({ courseId, taskId, minutes = 25 }) => {
    setActiveSession({
      courseId: courseId || null,
      taskId: taskId || null,
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
      status: 'running',
      startedAt: new Date().toISOString(),
    })
  }, [])

  const pauseSession = useCallback(() => {
    setActiveSession((s) => (s ? { ...s, status: 'paused' } : s))
  }, [])

  const resumeSession = useCallback(() => {
    setActiveSession((s) => (s ? { ...s, status: 'running' } : s))
  }, [])

  const tickSession = useCallback(() => {
    setActiveSession((s) => {
      if (!s || s.status !== 'running') return s
      const next = s.remainingSeconds - 1
      if (next <= 0) {
        return { ...s, remainingSeconds: 0, status: 'complete' }
      }
      return { ...s, remainingSeconds: next }
    })
  }, [])

  const resetSession = useCallback(() => {
    setActiveSession((s) => (s ? { ...s, remainingSeconds: s.totalSeconds, status: 'running' } : s))
  }, [])

  const clearSession = useCallback(() => setActiveSession(null), [])

  const finishSession = useCallback((topic) => {
    setActiveSession((s) => {
      if (!s) return s
      const elapsedSeconds = s.totalSeconds - s.remainingSeconds
      const minutes = Math.max(1, Math.round(elapsedSeconds / 60))
      const newSession = {
        id: makeId('s'),
        courseId: s.courseId,
        taskId: s.taskId,
        topic: topic || 'Focus session',
        durationMinutes: minutes,
        date: new Date().toISOString(),
      }
      setStudySessions((prev) => [newSession, ...prev])
      return { ...s, status: 'finished', savedMinutes: minutes }
    })
  }, [setStudySessions])

  // ---------- Onboarding / profile ----------
  const completeOnboarding = useCallback(() => setOnboardingComplete(true), [setOnboardingComplete])
  const updateProfile = useCallback((patch) => setProfile((p) => ({ ...p, ...patch })), [setProfile])

  const courseById = useCallback((id) => courses.find((c) => c.id === id), [courses])
  const taskById = useCallback((id) => tasks.find((t) => t.id === id), [tasks])

  const value = useMemo(
    () => ({
      onboardingComplete,
      completeOnboarding,
      courses,
      tasks,
      studySessions,
      profile,
      updateProfile,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      courseById,
      taskById,
      activeSession,
      startSession,
      pauseSession,
      resumeSession,
      tickSession,
      resetSession,
      clearSession,
      finishSession,
      toasts,
      showToast,
      dismissToast,
    }),
    [
      onboardingComplete,
      completeOnboarding,
      courses,
      tasks,
      studySessions,
      profile,
      updateProfile,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      courseById,
      taskById,
      activeSession,
      startSession,
      pauseSession,
      resumeSession,
      tickSession,
      resetSession,
      clearSession,
      finishSession,
      toasts,
      showToast,
      dismissToast,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
