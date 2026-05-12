import type { Tutorial } from '@/lib/supabase'

type Props = {
  tutorial: Tutorial
  authorName: string
}

export default function TutorialCard({ tutorial, authorName }: Props) {
  return (
    <article className="border p-4">
      <h2 className="text-lg font-semibold">
        <a href={`/tutorials/${tutorial.slug}`}>{tutorial.title}</a>
      </h2>
      <p className="text-sm mt-1">{tutorial.description}</p>
      <p className="text-sm mt-1">By {authorName}</p>
      {tutorial.tags.length > 0 && (
        <ul className="flex gap-2 mt-2 list-none p-0" aria-label="Tags">
          {tutorial.tags.map((tag) => (
            <li key={tag}>
              <span className="border px-2 py-0.5 text-xs">{tag}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
