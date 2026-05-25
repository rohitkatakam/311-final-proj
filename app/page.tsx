import type { Metadata } from 'next'
import TutorialCard from '@/components/TutorialCard'
import type { Tutorial } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'MakerAccess — Browse Tutorials',
}

type Props = {
  searchParams: Promise<{ tag?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { tag } = await searchParams

  const supabase = createClient()
  const { data } = await supabase
    .from('tutorials')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false })

  const allTutorials = (data ?? []) as (Tutorial & { profiles: { display_name: string } })[]

  const allTags = Array.from(new Set(allTutorials.flatMap((t) => t.tags))).sort()

  const filteredTutorials = tag
    ? allTutorials.filter((t) => t.tags.includes(tag))
    : allTutorials

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Makerspace Tutorials</h1>

      <form className="mb-4">
        <label htmlFor="tag-filter" className="mr-2">
          Filter by tag:
        </label>
        <select id="tag-filter" name="tag" defaultValue={tag ?? ''}>
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" className="ml-2">
          Filter
        </button>
      </form>

      <div aria-live="polite" aria-atomic="false">
        {filteredTutorials.length === 0 && allTutorials.length === 0 ? (
          <p>No tutorials yet. Be the first to submit one!</p>
        ) : filteredTutorials.length === 0 ? (
          <p>No tutorials found for tag &quot;{tag}&quot;.</p>
        ) : (
          <ul className="space-y-4 list-none p-0">
            {filteredTutorials.map((tutorial) => (
              <li key={tutorial.id}>
                <TutorialCard
                  tutorial={tutorial}
                  authorName={tutorial.profiles.display_name}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
