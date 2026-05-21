'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/slugify'

type StepDraft = {
  title: string
  content: string
  audio_hint: string
}

export default function SubmitForm({ session }: { session: Session }) {
  const [steps, setSteps] = useState<StepDraft[]>([
    { title: '', content: '', audio_hint: '' },
  ])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  function addStep() {
    setSteps((prev) => [...prev, { title: '', content: '', audio_hint: '' }])
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  function updateStep(index: number, field: keyof StepDraft, value: string) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value
    const tagsRaw = (form.elements.namedItem('tags') as HTMLInputElement).value

    const supabase = createClient()
    const slug = slugify(title)
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

    const { data: tutorial, error: tutorialError } = await supabase
      .from('tutorials')
      .insert({ title, slug, description, tags, author_id: session.user.id })
      .select()
      .single()

    if (tutorialError) {
      setError(tutorialError.message)
      setSubmitting(false)
      return
    }

    const stepRows = steps.map((step, i) => ({
      tutorial_id: tutorial.id,
      step_order: i + 1,
      title: step.title,
      content: step.content,
      audio_hint: step.audio_hint || null,
    }))

    const { error: stepsError } = await supabase.from('steps').insert(stepRows)
    if (stepsError) {
      setError(stepsError.message)
      setSubmitting(false)
      return
    }

    router.push(`/tutorials/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div role="alert" className="mb-4 text-red-700 border border-red-700 p-2">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          aria-required="true"
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          aria-required="true"
          rows={3}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="tags" className="block mb-1">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          name="tags"
          placeholder="e.g. soldering, breadboard, beginner"
          className="border p-2 w-full"
        />
      </div>

      <fieldset className="mb-6 border p-4">
        <legend className="font-semibold mb-2">Steps</legend>

        {steps.map((step, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h2 className="font-medium mb-2">Step {index + 1}</h2>

            <div className="mb-2">
              <label htmlFor={`step-title-${index}`} className="block mb-1">
                Step title
              </label>
              <input
                id={`step-title-${index}`}
                type="text"
                value={step.title}
                aria-required="true"
                onChange={(e) => updateStep(index, 'title', e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`step-content-${index}`} className="block mb-1">
                Step content
              </label>
              <textarea
                id={`step-content-${index}`}
                value={step.content}
                aria-required="true"
                rows={3}
                onChange={(e) => updateStep(index, 'content', e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div className="mb-2">
              <label htmlFor={`step-hint-${index}`} className="block mb-1">
                Audio hint (optional — tactile or audio cue)
              </label>
              <input
                id={`step-hint-${index}`}
                type="text"
                value={step.audio_hint}
                onChange={(e) => updateStep(index, 'audio_hint', e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {steps.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="text-red-700 underline"
              >
                Remove step {index + 1}
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addStep}
          className="px-4 py-2 border"
        >
          Add another step
        </button>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Tutorial'}
      </button>
    </form>
  )
}
