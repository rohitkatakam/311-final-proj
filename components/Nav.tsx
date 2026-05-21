'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav aria-label="Main navigation">
      <ul className="flex gap-4 list-none p-4 m-0">
        <li>
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/submit" aria-current={pathname === '/submit' ? 'page' : undefined}>
            Submit Tutorial
          </Link>
        </li>
        {!session ? (
          <>
            <li>
              <Link href="/login" aria-current={pathname === '/login' ? 'page' : undefined}>
                Log In
              </Link>
            </li>
            <li>
              <Link href="/signup" aria-current={pathname === '/signup' ? 'page' : undefined}>
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogOut}>Log Out</button>
          </li>
        )}
      </ul>
    </nav>
  )
}
