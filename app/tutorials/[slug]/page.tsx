import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import StepPlayer from '@/components/StepPlayer'
import type { Step } from '@/lib/supabase'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('tutorials')
    .select('title')
    .eq('slug', params.slug)
    .single()
  return { title: data ? `MakerAccess — ${data.title}` : 'MakerAccess' }
}

export default async function TutorialPage({ params }: Props) {
  const supabase = createClient()

  const { data: tutorial } = await supabase
    .from('tutorials')
    .select('*, profiles(display_name)')
    .eq('slug', params.slug)
    .single()

  if (!tutorial) notFound()

  const { data: steps } = await supabase
    .from('steps')
    .select('*')
    .eq('tutorial_id', tutorial.id)
    .order('step_order', { ascending: true })

  const safeSteps = steps ?? []

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{tutorial.title}</h1>
      <p className="text-sm mb-1">
        By {tutorial.profiles.display_name}
      </p>
      {tutorial.tags.length > 0 && (
        <p className="text-sm mb-4">
          Tags: {tutorial.tags.join(', ')}
        </p>
      )}
      <p className="mb-6">{tutorial.description}</p>
      <StepPlayer steps={safeSteps} />
    </div>
  )
}
