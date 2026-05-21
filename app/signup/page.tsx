'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const displayName = (form.elements.namedItem('display_name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) { setError(signUpError.message); return }
    await supabase.from('profiles').insert({ id: data.user!.id, display_name: displayName })
    router.push('/')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      {error && (
        <div role="alert" className="mb-4 text-red-700 border border-red-700 p-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="display_name" className="block mb-1">
            Display Name
          </label>
          <input
            id="display_name"
            type="text"
            name="display_name"
            aria-required="true"
            autoComplete="nickname"
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            aria-required="true"
            autoComplete="email"
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            aria-required="true"
            autoComplete="new-password"
            className="border p-2 w-full"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
          Create Account
        </button>
      </form>

      <p className="mt-4">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  )
}
