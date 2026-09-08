import { useState } from 'react'
import { Header } from './header'
import { MobileNav } from './mobile-nav'
import { HomePage } from './home-page'
import { FeaturePage } from './feature-page'

export function Dashboard() {
  const [page, setPage] = useState('home')

  const handleNavigate = (id) => {
    setPage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-artboard bg-earth-50/60 pb-20 md:pb-8">
      <Header page={page} onNavigate={handleNavigate} />

      <main>
        {page === 'home' ? (
          <HomePage onNavigate={handleNavigate} />
        ) : (
          <FeaturePage pageId={page} onNavigate={handleNavigate} />
        )}
      </main>

      <MobileNav page={page} onNavigate={handleNavigate} />
    </div>
  )
}

