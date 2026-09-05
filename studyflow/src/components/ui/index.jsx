import React from 'react'

export function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon: Icon,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none'
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-[15px] px-5 py-3.5',
  }
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-pop',
    secondary: 'bg-primary-light text-primary hover:bg-primary/15',
    outline: 'bg-white text-ink border border-border hover:border-primary/40 hover:text-primary',
    ghost: 'text-ink-soft hover:bg-black/[0.04] hover:text-ink',
    danger: 'bg-white text-error border border-error/25 hover:bg-error/5',
  }
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={size === 'lg' ? 19 : 16} strokeWidth={2.25} />}
      {children}
    </As>
  )
}

export function IconButton({ icon: Icon, label, className = '', size = 18, variant = 'ghost', ...props }) {
  const variants = {
    ghost: 'hover:bg-black/[0.045] text-ink-soft hover:text-ink',
    solid: 'bg-white border border-border text-ink hover:border-primary/40',
    primary: 'bg-primary-light text-primary hover:bg-primary/15',
  }
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150 active:scale-[0.94] ${variants[variant]} ${className}`}
      {...props}
    >
      <Icon size={size} strokeWidth={2.1} />
    </button>
  )
}

export function Card({ className = '', children, as: As = 'div', hoverable = false, ...props }) {
  return (
    <As
      className={`bg-white rounded-2xl border border-border shadow-soft ${
        hoverable ? 'transition-all duration-200 hover:shadow-card hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </As>
  )
}

const priorityStyles = {
  high: 'bg-error/10 text-error',
  medium: 'bg-warning/15 text-warning',
  low: 'bg-ink-soft/10 text-ink-soft',
}
const priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' }

export function PriorityBadge({ priority = 'medium', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${priorityStyles[priority]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {priorityLabel[priority]}
    </span>
  )
}

export function Badge({ tone = 'default', className = '', children }) {
  const tones = {
    default: 'bg-black/[0.045] text-ink-soft',
    primary: 'bg-primary-light text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-error/10 text-error',
  }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function ProgressBar({ percent, color = '#635BFF', trackClassName = '', className = '', height = 8 }) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div
      className={`w-full bg-black/[0.06] rounded-full overflow-hidden ${trackClassName}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${className}`}
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function ProgressCircle({ percent, size = 56, stroke = 6, color = '#635BFF', trackColor = '#EFEFF6', children }) {
  const clamped = Math.max(0, Math.min(100, percent))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export function Input({ label, hint, error, className = '', id, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[15px] text-ink placeholder:text-ink-soft/60 transition-colors duration-150 ${
          error ? 'border-error' : 'border-border focus:border-primary'
        } outline-none focus:ring-2 focus:ring-primary/15 ${className}`}
        {...props}
      />
      {hint && !error && <span className="block text-xs text-ink-soft mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-error mt-1.5">{error}</span>}
    </label>
  )
}

export function Textarea({ label, hint, className = '', id, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <textarea
        id={inputId}
        className={`w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors duration-150 resize-none ${className}`}
        {...props}
      />
      {hint && <span className="block text-xs text-ink-soft mt-1.5">{hint}</span>}
    </label>
  )
}

export function Select({ label, className = '', id, children, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <div className="relative">
        <select
          id={inputId}
          className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border border-border bg-white text-[15px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors duration-150 ${className}`}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  )
}

const avatarPalette = ['#635BFF', '#22C55E', '#F59E0B', '#0EA5E9', '#EC4899', '#EF4444']
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return hash
}

export function Avatar({ name = '', size = 40, className = '' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const color = avatarPalette[hashString(name) % avatarPalette.length]
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {initials || '?'}
    </div>
  )
}

export function SegmentedTabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1 bg-black/[0.045] p-1 rounded-xl ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
            active === tab.value ? 'bg-white text-ink shadow-soft' : 'text-ink-soft hover:text-ink'
          }`}
        >
          {tab.label}
          {typeof tab.count === 'number' && (
            <span className={`ml-1.5 ${active === tab.value ? 'text-primary' : 'text-ink-soft/70'}`}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
