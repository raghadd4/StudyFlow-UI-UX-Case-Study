import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2, Flame, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui'

const slides = [
  {
    icon: Sparkles,
    heading: 'Study smarter. Stress less.',
    subtitle: 'Organize your courses, deadlines, and study sessions in one simple place.',
    accent: '#635BFF',
  },
  {
    icon: CalendarCheck2,
    heading: 'Plan your day',
    subtitle: 'Know exactly what needs to be done and when — no more checking five different apps.',
    accent: '#0EA5E9',
  },
  {
    icon: Flame,
    heading: 'Build better habits',
    subtitle: 'Track your study sessions and watch your progress grow, one focus session at a time.',
    accent: '#F59E0B',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const { completeOnboarding } = useApp()
  const navigate = useNavigate()
  const isLast = step === slides.length - 1
  const slide = slides[step]

  const finish = () => {
    completeOnboarding()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="flex justify-between items-center px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-white" />
          </div>
          <span className="font-bold text-ink">StudyFlow</span>
        </div>
        {!isLast && (
          <button onClick={finish} className="text-sm font-medium text-ink-soft hover:text-ink">
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-md mx-auto w-full">
        <div
          key={step}
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 animate-scale-in"
          style={{ backgroundColor: `${slide.accent}18` }}
        >
          <slide.icon size={44} strokeWidth={1.75} style={{ color: slide.accent }} />
        </div>

        <h1 key={`h-${step}`} className="text-[26px] leading-tight font-display font-semibold text-ink mb-3 animate-fade-up">
          {slide.heading}
        </h1>
        <p key={`s-${step}`} className="text-[15px] text-ink-soft leading-relaxed animate-fade-up">
          {slide.subtitle}
        </p>
      </div>

      <div className="px-8 pb-10 max-w-md mx-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-6" role="tablist" aria-label="Onboarding progress">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
        >
          {isLast ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
