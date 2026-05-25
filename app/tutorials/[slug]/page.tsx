import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import StepPlayer from '@/components/StepPlayer'
import DeleteButton from '@/components/DeleteButton'

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

  const [{ data: { session } }, { data: tutorial }, ] = await Promise.all([
    supabase.auth.getSession(),
    supabase
      .from('tutorials')
      .select('*, profiles(display_name)')
      .eq('slug', params.slug)
      .single(),
  ])

  if (!tutorial) notFound()

  const { data: steps } = await supabase
    .from('steps')
    .select('*')
    .eq('tutorial_id', tutorial.id)
    .order('step_order', { ascending: true })

  const safeSteps = steps ?? []
  const isAuthor = session?.user?.id === tutorial.author_id

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

      {isAuthor && (
        <div className="flex gap-4 mb-6 text-sm">
          <Link href={`/tutorials/${tutorial.slug}/edit`} className="underline">
            Edit tutorial
          </Link>
          <DeleteButton tutorialId={tutorial.id} />
        </div>
      )}

      <StepPlayer steps={safeSteps} />
    </div>
  )
}
