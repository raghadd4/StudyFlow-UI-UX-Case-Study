import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import AppLayout from './layouts/AppLayout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import Tasks from './pages/Tasks'
import TaskDetails from './pages/TaskDetails'
import AddEditTask from './pages/AddEditTask'
import StudySession from './pages/StudySession'
import Progress from './pages/Progress'
import Profile from './pages/Profile'

export default function App() {
  const { onboardingComplete } = useApp()

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={onboardingComplete ? <Navigate to="/" replace /> : <Onboarding />}
      />

      <Route
        element={onboardingComplete ? <AppLayout /> : <Navigate to="/onboarding" replace />}
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<AddEditTask />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/tasks/:id/edit" element={<AddEditTask />} />
        <Route path="/study" element={<StudySession />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
