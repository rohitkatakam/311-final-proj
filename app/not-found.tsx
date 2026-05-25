import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MakerAccess — Page Not Found',
}

export default function NotFound() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Page not found</h1>
      <p className="mb-4">That tutorial doesn't exist or may have been removed.</p>
      <Link href="/" className="underline">
        Back to all tutorials
      </Link>
    </div>
  )
}
