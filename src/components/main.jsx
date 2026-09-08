import { useState, useEffect } from 'react'
import { Header } from './header'
import { MobileNav } from './mobile-nav'
import { MobileSplash } from './mobile-splash'
import { MobileHome } from './mobile-home'
import { HomePage } from './home-page'
import { FeaturePage } from './feature-page'

export function Dashboard() {
  const [page, setPage] = useState('home')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash on mobile devices / small screens
    return typeof window !== 'undefined' && window.innerWidth < 768
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavigate = (id) => {
    setPage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-artboard bg-earth-50/60 pb-20 md:pb-8">
      {/* Native App Opening Splash for Mobile */}
      {showSplash && <MobileSplash onFinish={() => setShowSplash(false)} />}

      <Header page={page} onNavigate={handleNavigate} />

      <main>
        {page === 'home' ? (
          <>
            {/* On Mobile Screens (< 768px): Dedicated Smartphone App Home UI */}
            <div className="block md:hidden">
              <MobileHome onNavigate={handleNavigate} />
            </div>

            {/* On Laptop & Desktop Screens (>= 768px): Expansive Command Center UI */}
            <div className="hidden md:block">
              <HomePage onNavigate={handleNavigate} />
            </div>
          </>
        ) : (
          <FeaturePage pageId={page} onNavigate={handleNavigate} />
        )}
      </main>

      <MobileNav page={page} onNavigate={handleNavigate} />
    </div>
  )
}


