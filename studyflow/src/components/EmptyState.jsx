import React from 'react'
import { Button } from './ui'

export default function EmptyState({ emoji = '🎉', title, subtitle, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-14 px-6 ${className}`}>
      <div className="text-4xl mb-3" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-ink-soft max-w-xs mb-5">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
