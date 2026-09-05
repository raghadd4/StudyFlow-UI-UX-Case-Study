import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, BookOpen, CheckSquare, Timer, BarChart3, Settings, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Avatar } from '../components/ui'
import ToastHost from '../components/ToastHost'

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/study', label: 'Study', icon: Timer },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
]

const mobileNavItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, afterAdd: true },
  { to: '/profile', label: 'Profile', icon: Settings },
]

export default function AppLayout() {
  const { profile } = useApp()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-border bg-white px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-3 h-3 rounded-[3px] bg-white" />
          </div>
          <span className="text-lg font-bold text-ink tracking-tight">StudyFlow</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors duration-150 ${
                  isActive ? 'bg-primary-light text-primary' : 'text-ink-soft hover:bg-black/[0.035] hover:text-ink'
                }`
              }
            >
              <item.icon size={19} strokeWidth={2.1} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-1 pt-4 border-t border-border">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors duration-150 ${
                isActive ? 'bg-primary-light text-primary' : 'text-ink-soft hover:bg-black/[0.035] hover:text-ink'
              }`
            }
          >
            <Avatar name={profile.name} size={26} />
            <span className="truncate">{profile.name}</span>
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 pb-24 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-border px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {mobileNavItems.slice(0, 2).map((item) => (
            <MobileNavLink key={item.to} item={item} />
          ))}

          <button
            onClick={() => navigate('/tasks/new')}
            aria-label="Add a task"
            className="w-14 h-14 -mt-6 rounded-full bg-primary text-white flex items-center justify-center shadow-pop active:scale-95 transition-transform duration-150"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>

          {mobileNavItems.slice(2).map((item) => (
            <MobileNavLink key={item.to} item={item} />
          ))}
        </div>
      </nav>

      <ToastHost />
    </div>
  )
}

function MobileNavLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium min-w-[56px] ${
          isActive ? 'text-primary' : 'text-ink-soft'
        }`
      }
    >
      <item.icon size={21} strokeWidth={2.1} />
      {item.label}
    </NavLink>
  )
}
