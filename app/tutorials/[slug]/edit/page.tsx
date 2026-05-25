import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import EditForm from './EditForm'

export const metadata: Metadata = {
  title: 'MakerAccess — Edit Tutorial',
}

type Props = {
  params: { slug: string }
}

export default async function EditPage({ params }: Props) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: tutorial } = await supabase
    .from('tutorials')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!tutorial) notFound()
  if (tutorial.author_id !== session.user.id) redirect(`/tutorials/${params.slug}`)

  const { data: steps } = await supabase
    .from('steps')
    .select('*')
    .eq('tutorial_id', tutorial.id)
    .order('step_order', { ascending: true })

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Tutorial</h1>
      <EditForm tutorial={tutorial} steps={steps ?? []} />
    </div>
  )
}
