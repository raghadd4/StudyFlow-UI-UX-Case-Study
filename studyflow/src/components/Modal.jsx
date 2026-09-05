import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './ui'

export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-md' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-scale-in"
        style={{ animationDuration: '0.2s' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative w-full ${maxWidth} bg-white rounded-t-2xl sm:rounded-2xl shadow-card outline-none max-h-[88vh] flex flex-col animate-slide-up-in sm:animate-scale-in`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 id="modal-title" className="text-base font-semibold text-ink">
            {title}
          </h2>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-border shrink-0">{footer}</div>}
      </div>
    </div>
  )
}
