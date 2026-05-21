'use client'

import { useState, useRef } from 'react'
import type { Step } from '@/lib/supabase'

type Props = {
  steps: Step[]
}

function speakAndWait(text: string): Promise<void> {
  return new Promise((resolve) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

export default function StepPlayer({ steps }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [currentStepTitle, setCurrentStepTitle] = useState<string | null>(null)
  const stopRef = useRef(false)

  function readStep(step: Step) {
    const text = step.audio_hint
      ? `${step.content}. ${step.audio_hint}`
      : step.content
    setCurrentStepTitle(step.title)
    setSpeaking(true)
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => {
      setSpeaking(false)
    }
    window.speechSynthesis.speak(utterance)
  }

  async function readAll() {
    if (steps.length === 0) return
    stopRef.current = false
    setSpeaking(true)
    for (const step of steps) {
      if (stopRef.current) break
      setCurrentStepTitle(step.title)
      const text = step.audio_hint
        ? `${step.content}. ${step.audio_hint}`
        : step.content
      await speakAndWait(text)
      await new Promise((r) => setTimeout(r, 600))
    }
    setSpeaking(false)
    setCurrentStepTitle(null)
  }

  function stopReading() {
    stopRef.current = true
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setCurrentStepTitle(null)
  }

  return (
    <div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {currentStepTitle ? `Now reading: ${currentStepTitle}` : ''}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={readAll}
          aria-label="Read all steps aloud"
          className="px-4 py-2 border"
        >
          Read all steps
        </button>
        {speaking && (
          <button
            type="button"
            onClick={stopReading}
            aria-label="Stop reading"
            className="px-4 py-2 border"
          >
            Stop reading
          </button>
        )}
      </div>

      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.id} className="border p-4">
            <h2 className="font-semibold mb-2">
              Step {step.step_order}: {step.title}
            </h2>
            <p className="mb-3">{step.content}</p>
            <button
              type="button"
              onClick={() => readStep(step)}
              aria-label={`Read step aloud: ${step.title}`}
              className="px-3 py-1 border text-sm"
            >
              Read aloud
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
