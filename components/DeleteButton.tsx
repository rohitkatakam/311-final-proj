'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DeleteButton({ tutorialId }: { tutorialId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this tutorial? This cannot be undone.')) return
    setDeleting(true)
    setError(null)

    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('tutorials')
      .delete()
      .eq('id', tutorialId)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
      return
    }

    router.push('/')
  }

  return (
    <div>
      {error && (
        <p role="alert" className="text-red-700 mb-2">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete this tutorial"
        className="underline text-red-700 disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete tutorial'}
      </button>
    </div>
  )
}
