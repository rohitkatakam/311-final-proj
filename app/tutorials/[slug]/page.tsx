import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import StepPlayer from '@/components/StepPlayer'
import type { Tutorial, Step } from '@/lib/supabase'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // TODO: fetch tutorial title from Supabase for dynamic metadata
  return {
    title: `MakerAccess — ${params.slug}`,
  }
}

export default async function TutorialPage({ params }: Props) {
  // TODO: const supabase = createClient()
  // TODO: const { data: tutorial } = await supabase
  //   .from('tutorials')
  //   .select('*, profiles(display_name)')
  //   .eq('slug', params.slug)
  //   .single()
  // TODO: if (!tutorial) notFound()
  // TODO: const { data: steps } = await supabase
  //   .from('steps')
  //   .select('*')
  //   .eq('tutorial_id', tutorial.id)
  //   .order('step_order', { ascending: true })

  // TODO: Replace with actual Supabase fetch; remove the cast below
  const tutorial = null as unknown as Tutorial & { profiles: { display_name: string } }
  const steps: Step[] = []

  if (!tutorial) notFound()

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
      <StepPlayer steps={steps} />
    </div>
  )
}
