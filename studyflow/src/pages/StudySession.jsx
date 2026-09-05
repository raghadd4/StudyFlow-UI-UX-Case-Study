import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Pause, Play, RotateCcw, Square, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Select, ProgressCircle, IconButton } from '../components/ui'
import { formatMinutes } from '../utils/dateUtils'

const DURATIONS = [15, 25, 45, 60]

export default function StudySession() {
  const location = useLocation()
  const navigate = useNavigate()
  const { courses, taskById, activeSession, startSession, pauseSession, resumeSession, tickSession, resetSession, finishSession, clearSession, showToast } = useApp()

  const presetCourseId = location.state?.courseId
  const presetTaskId = location.state?.taskId
  const presetTask = presetTaskId ? taskById(presetTaskId) : null

  const [courseId, setCourseId] = useState(presetCourseId || courses[0]?.id || '')
  const [minutes, setMinutes] = useState(25)

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'running') return
    const interval = setInterval(() => tickSession(), 1000)
    return () => clearInterval(interval)
  }, [activeSession?.status, tickSession])

  const handleStart = () => {
    startSession({ courseId, taskId: presetTaskId, minutes })
  }

  const handleFinish = () => {
    finishSession(presetTask?.title || courses.find((c) => c.id === courseId)?.name)
  }

  const handleReturnToDashboard = () => {
    clearSession()
    showToast('Study session saved')
    navigate(presetTaskId ? `/tasks/${presetTaskId}` : '/')
  }

  // ---------- Setup screen ----------
  if (!activeSession) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-5">
          <Sparkles size={28} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-ink mb-1">Focus Session</h1>
        <p className="text-sm text-ink-soft mb-8">Pick a course and a duration, then get in the zone.</p>

        <div className="w-full flex flex-col gap-5 text-left">
          {presetTask ? (
            <div className="bg-white border border-border rounded-2xl px-4 py-3.5">
              <p className="text-xs text-ink-soft mb-0.5">Task</p>
              <p className="text-sm font-medium text-ink">{presetTask.title}</p>
            </div>
          ) : (
            <Select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          )}

          <div>
            <span className="block text-sm font-medium text-ink mb-1.5">Session length</span>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setMinutes(d)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors duration-150 ${
                    minutes === d ? 'bg-primary-light border-primary text-primary' : 'border-border text-ink-soft hover:border-primary/30'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" icon={Play} onClick={handleStart} className="w-full mt-2">
            Start Session
          </Button>
        </div>
      </div>
    )
  }

  const course = courses.find((c) => c.id === activeSession.courseId)
  const task = activeSession.taskId ? taskById(activeSession.taskId) : null
  const percent = ((activeSession.totalSeconds - activeSession.remainingSeconds) / activeSession.totalSeconds) * 100
  const mm = String(Math.floor(activeSession.remainingSeconds / 60)).padStart(2, '0')
  const ss = String(activeSession.remainingSeconds % 60).padStart(2, '0')

  // ---------- Completion screen ----------
  if (activeSession.status === 'complete' || activeSession.status === 'finished') {
    if (activeSession.status === 'finished') {
      return (
        <div className="max-w-md mx-auto px-4 sm:px-6 pt-16 pb-10 flex flex-col items-center text-center">
          <div className="text-5xl mb-4 animate-scale-in">🎉</div>
          <h1 className="text-xl font-bold text-ink mb-1">Great job!</h1>
          <p className="text-sm text-ink-soft mb-6">
            You completed a <span className="font-semibold text-ink">{activeSession.savedMinutes} minute study session</span>.
          </p>
          <div className="bg-success/10 text-success font-semibold rounded-xl px-4 py-2.5 mb-8">
            +{activeSession.savedMinutes} min study time
          </div>
          <Button size="lg" className="w-full" onClick={handleReturnToDashboard}>
            Finish Session
          </Button>
        </div>
      )
    }
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 pt-16 pb-10 flex flex-col items-center text-center">
        <div className="text-5xl mb-4 animate-scale-in">🎉</div>
        <h1 className="text-xl font-bold text-ink mb-1">Great job!</h1>
        <p className="text-sm text-ink-soft mb-8">
          You completed a <span className="font-semibold text-ink">{Math.round(activeSession.totalSeconds / 60)} minute study session</span>.
        </p>
        <Button size="lg" className="w-full" onClick={handleFinish}>
          Finish Session
        </Button>
      </div>
    )
  }

  // ---------- Running / paused screen ----------
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-10 flex flex-col items-center text-center">
      <h1 className="text-xl font-bold text-ink mb-1">Focus Session</h1>
      {course && <p className="text-sm text-ink-soft mb-1">{course.name}</p>}
      {task && <p className="text-sm text-ink-soft mb-8">{task.title}</p>}
      {!task && <div className="mb-8" />}

      <ProgressCircle percent={percent} size={220} stroke={10} color={course?.color || '#635BFF'}>
        <span className="text-5xl font-display font-semibold text-ink tabular-nums">{mm}:{ss}</span>
      </ProgressCircle>

      <p className="text-sm text-ink-soft mt-8 mb-8">Stay focused. You've got this! ✨</p>

      <div className="flex items-center gap-3">
        <IconButton
          icon={RotateCcw}
          label="Reset"
          variant="solid"
          size={19}
          className="!w-12 !h-12"
          onClick={resetSession}
        />
        {activeSession.status === 'running' ? (
          <button
            onClick={pauseSession}
            aria-label="Pause"
            className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-pop active:scale-95 transition-transform"
          >
            <Pause size={26} fill="white" />
          </button>
        ) : (
          <button
            onClick={resumeSession}
            aria-label="Resume"
            className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-pop active:scale-95 transition-transform"
          >
            <Play size={26} fill="white" className="ml-0.5" />
          </button>
        )}
        <IconButton
          icon={Square}
          label="Finish early"
          variant="solid"
          size={19}
          className="!w-12 !h-12 hover:!text-error hover:!border-error/40"
          onClick={handleFinish}
        />
      </div>
    </div>
  )
}
