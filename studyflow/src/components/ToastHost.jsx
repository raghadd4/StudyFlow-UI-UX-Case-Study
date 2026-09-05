import React from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const iconColors = { success: 'text-success', error: 'text-error', info: 'text-primary' }

export default function ToastHost() {
  const { toasts, dismissToast } = useApp()
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm"
      aria-live="polite"
      role="status"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info
        return (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 bg-white border border-border shadow-card rounded-xl px-4 py-3 animate-toast-in"
          >
            <Icon size={18} className={`shrink-0 ${iconColors[toast.type] || iconColors.info}`} />
            <p className="text-sm font-medium text-ink flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-ink-soft hover:text-ink shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
