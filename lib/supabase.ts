import { createBrowserClient } from '@supabase/ssr'

export type Profile = {
  id: string
  display_name: string
  created_at: string
}

export type Tutorial = {
  id: string
  slug: string
  title: string
  description: string
  author_id: string
  tags: string[]
  created_at: string
}

export type Step = {
  id: string
  tutorial_id: string
  step_order: number
  title: string
  content: string
  audio_hint: string | null
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
