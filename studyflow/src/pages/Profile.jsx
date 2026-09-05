import React from 'react'
import { Bell, Palette, Globe, Info, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Card, Avatar } from '../components/ui'
import { totalMinutes, overallTaskStats, studyStreak } from '../utils/derive'
import { formatMinutes } from '../utils/dateUtils'

export default function Profile() {
  const { profile, updateProfile, tasks, studySessions, showToast } = useApp()
  const weekMinutes = totalMinutes(studySessions, 7)
  const taskStats = overallTaskStats(tasks)
  const streak = studyStreak(studySessions)

  const toggleNotifications = () => {
    updateProfile({ notifications: !profile.notifications })
    showToast(profile.notifications ? 'Notifications turned off' : 'Notifications turned on')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-10">
      <h1 className="text-[26px] md:text-[28px] font-bold text-ink leading-tight mb-6">Profile</h1>

      <Card className="p-6 flex items-center gap-4 mb-5">
        <Avatar name={profile.name} size={56} />
        <div>
          <p className="text-lg font-bold text-ink">{profile.name}</p>
          <p className="text-sm text-ink-soft">{profile.role}</p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 text-center">
          <p className="text-lg font-bold text-ink">{formatMinutes(weekMinutes)}</p>
          <p className="text-xs text-ink-soft mt-1">This week</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-lg font-bold text-ink">{taskStats.done}</p>
          <p className="text-xs text-ink-soft mt-1">Tasks completed</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-lg font-bold text-ink">{streak}</p>
          <p className="text-xs text-ink-soft mt-1">Day streak</p>
        </Card>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2 px-1">Settings</p>
      <Card className="divide-y divide-border overflow-hidden">
        <button onClick={toggleNotifications} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-black/[0.02] transition-colors text-left">
          <Bell size={18} className="text-ink-soft shrink-0" />
          <span className="flex-1 text-sm font-medium text-ink">Notifications</span>
          <span
            className={`w-10 h-6 rounded-full p-0.5 transition-colors ${profile.notifications ? 'bg-primary' : 'bg-black/10'}`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${profile.notifications ? 'translate-x-4' : ''}`}
            />
          </span>
        </button>

        <SettingsRow icon={Palette} label="Appearance" value={profile.appearance === 'light' ? 'Light' : 'Dark'} />
        <SettingsRow icon={Globe} label="Language" value={profile.language} />
        <SettingsRow icon={Info} label="About StudyFlow" value="v1.0.0" />
      </Card>
    </div>
  )
}

function SettingsRow({ icon: Icon, label, value }) {
  return (
    <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-black/[0.02] transition-colors text-left">
      <Icon size={18} className="text-ink-soft shrink-0" />
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <span className="text-sm text-ink-soft">{value}</span>
      <ChevronRight size={16} className="text-ink-soft" />
    </button>
  )
}
