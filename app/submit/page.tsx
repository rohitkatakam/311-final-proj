import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import SubmitForm from './SubmitForm'

export const metadata: Metadata = {
  title: 'MakerAccess — Submit a Tutorial',
}

export default async function SubmitPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a Tutorial</h1>
      <SubmitForm session={session} />
    </div>
  )
}
