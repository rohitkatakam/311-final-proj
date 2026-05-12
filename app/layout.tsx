import type { Metadata } from 'next'
import './globals.css'
import SkipLink from '@/components/SkipLink'
import Nav from '@/components/Nav'
import ContrastToggle from '@/components/ContrastToggle'

export const metadata: Metadata = {
  title: 'MakerAccess',
  description: 'Accessible makerspace tutorials for everyone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <header>
          <Nav />
          <ContrastToggle />
        </header>
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
