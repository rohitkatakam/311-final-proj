'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/submit', label: 'Submit Tutorial' },
  { href: '/login', label: 'Log In' },
  { href: '/signup', label: 'Sign Up' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation">
      <ul className="flex gap-4 list-none p-4 m-0">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
