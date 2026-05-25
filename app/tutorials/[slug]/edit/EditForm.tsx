'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Tutorial, Step } from '@/lib/supabase'

type StepDraft = {
  title: string
  content: string
  audio_hint: string
}

type Props = {
  tutorial: Tutorial
  steps: Step[]
}

export default function EditForm({ tutorial, steps }: Props) {
  const [stepDrafts, setStepDrafts] = useState<StepDraft[]>(
    steps.map((s) => ({ title: s.title, content: s.content, audio_hint: s.audio_hint ?? '' }))
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  function addStep() {
    setStepDrafts((prev) => [...prev, { title: '', content: '', audio_hint: '' }])
  }

  function removeStep(index: number) {
    setStepDrafts((prev) => prev.filter((_, i) => i !== index))
  }

  function updateStep(index: number, field: keyof StepDraft, value: string) {
    setStepDrafts((prev) =>
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
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)

    const supabase = createClient()

    const { error: tutorialError } = await supabase
      .from('tutorials')
      .update({ title, description, tags })
      .eq('id', tutorial.id)

    if (tutorialError) {
      setError(tutorialError.message)
      setSubmitting(false)
      return
    }

    const { error: deleteError } = await supabase
      .from('steps')
      .delete()
      .eq('tutorial_id', tutorial.id)

    if (deleteError) {
      setError(deleteError.message)
      setSubmitting(false)
      return
    }

    const stepRows = stepDrafts.map((step, i) => ({
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

    router.push(`/tutorials/${tutorial.slug}`)
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
          defaultValue={tutorial.title}
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
          defaultValue={tutorial.description}
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
          defaultValue={tutorial.tags.join(', ')}
          className="border p-2 w-full"
        />
      </div>

      <fieldset className="mb-6 border p-4">
        <legend className="font-semibold mb-2">Steps</legend>

        {stepDrafts.map((step, index) => (
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

            {stepDrafts.length > 1 && (
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

        <button type="button" onClick={addStep} className="px-4 py-2 border">
          Add another step
        </button>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
