'use client'

import { useEffect, useState } from 'react'

export default function ContrastToggle() {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('highContrast') === 'true'
    setHighContrast(stored)
    document.documentElement.classList.toggle('high-contrast', stored)
  }, [])

  function toggle() {
    const next = !highContrast
    setHighContrast(next)
    document.documentElement.classList.toggle('high-contrast', next)
    localStorage.setItem('highContrast', String(next))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={highContrast}
      className="px-3 py-1 border"
    >
      {highContrast ? 'Turn off high contrast' : 'Turn on high contrast'}
    </button>
  )
}
