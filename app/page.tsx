import type { Metadata } from 'next'
import TutorialCard from '@/components/TutorialCard'
import type { Tutorial } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'MakerAccess — Browse Tutorials',
}

export default async function HomePage() {
  // TODO: const supabase = createClient()
  // TODO: const { data: tutorials } = await supabase
  //   .from('tutorials')
  //   .select('*, profiles(display_name)')
  //   .order('created_at', { ascending: false })

  const tutorials: (Tutorial & { profiles: { display_name: string } })[] = []
  const allTags: string[] = []

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Makerspace Tutorials</h1>

      <div className="mb-4">
        <label htmlFor="tag-filter" className="mr-2">
          Filter by tag:
        </label>
        <select id="tag-filter" name="tag" defaultValue="">
          <option value="">All tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div aria-live="polite" aria-atomic="false">
        {tutorials.length === 0 ? (
          <p>No tutorials yet. Be the first to submit one!</p>
        ) : (
          <ul className="space-y-4 list-none p-0">
            {tutorials.map((tutorial) => (
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
